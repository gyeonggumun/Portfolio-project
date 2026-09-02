import { 
  generateRegistrationOptions, verifyRegistrationResponse, 
  generateAuthenticationOptions, verifyAuthenticationResponse 
} from '@simplewebauthn/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const SECRET = "super_secret_key_for_assignment";

if (!global.db) {
  global.db = {
    users: { "user123": { id: "user123", username: "testuser", devices: [] } },
    challenges: {}
  };
}

export default async function handler(req, res) {
  const { action } = req.query;
  const user = global.db.users["user123"];
  const rpid = req.headers.host.split(':')[0];
  const expectedOrigin = `https://${req.headers.host}`;

  try {
    if (action === 'register-generate') {
      const options = await generateRegistrationOptions({
        rpName: 'My Portfolio',
        rpID: rpid,
        userID: new TextEncoder().encode(user.id),
        userName: user.username,
        attestationType: 'none',
        excludeCredentials: user.devices.map(dev => ({ id: dev.credentialID, type: 'public-key' })),
      });
      global.db.challenges[user.id] = options.challenge;
      return res.status(200).json(options);
    }

    if (action === 'register-verify') {
      const expectedChallenge = global.db.challenges[user.id];
      const verification = await verifyRegistrationResponse({
        response: req.body.response, expectedChallenge, expectedOrigin, expectedRPID: rpid,
      });
      if (verification.verified) {
        user.devices.push({
          credentialID: verification.registrationInfo.credentialID,
          credentialPublicKey: verification.registrationInfo.credentialPublicKey,
          counter: verification.registrationInfo.counter,
          name: req.body.deviceName || `Device ${user.devices.length + 1}`,
          createdAt: new Date().toISOString()
        });
        delete global.db.challenges[user.id];
        return res.status(200).json({ verified: true });
      }
    }

    if (action === 'login-generate') {
      const options = await generateAuthenticationOptions({
        rpID: rpid,
        allowCredentials: user.devices.map(dev => ({ id: dev.credentialID, type: 'public-key' })),
        userVerification: 'preferred',
      });
      global.db.challenges[user.id] = options.challenge;
      return res.status(200).json(options);
    }

    if (action === 'login-verify') {
      const expectedChallenge = global.db.challenges[user.id];
      if (!expectedChallenge) return res.status(400).json({ error: "Challenge not found" });

      const device = user.devices.find(dev => dev.credentialID === req.body.id);
      if (!device) return res.status(400).json({ error: "Device not registered" });

      const verification = await verifyAuthenticationResponse({
        response: req.body, expectedChallenge, expectedOrigin, expectedRPID: rpid,
        authenticator: { credentialPublicKey: device.credentialPublicKey, credentialID: device.credentialID, counter: device.counter },
      });

      if (verification.verified) {
        device.counter = verification.authenticationInfo.newCounter;
        delete global.db.challenges[user.id];
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
        res.setHeader('Set-Cookie', serialize('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' }));
        return res.status(200).json({ verified: true });
      }
    }

    if (action === 'logout') {
      res.setHeader('Set-Cookie', serialize('auth_token', '', { maxAge: -1, path: '/' }));
      return res.status(200).json({ success: true });
    }

    if (action === 'private-data') {
      const token = req.cookies?.auth_token;
      if (!token) return res.status(401).json({ error: "Unauthorized" });
      jwt.verify(token, SECRET);
      return res.status(200).json([
        { id: 1, title: "준비 중인 프로젝트 메모", content: "React 19 마이그레이션" },
        { id: 2, title: "지원하려는 곳 목록", content: "A사, B사" },
        { id: 3, title: "스스로 쓰는 회고", content: "비밀번호 없는 로그인 구현 완료" }
      ]);
    }

    if (action === 'passkeys') {
      const token = req.cookies?.auth_token;
      if (!token) return res.status(401).json({ error: "Unauthorized" });
      const decoded = jwt.verify(token, SECRET);
      const currentUser = global.db.users[decoded.id];

      if (req.method === 'GET') {
        return res.status(200).json(currentUser.devices.map(d => ({ credentialID: d.credentialID, name: d.name, createdAt: d.createdAt })));
      }
      if (req.method === 'DELETE') {
        currentUser.devices = currentUser.devices.filter(d => d.credentialID !== req.body.credentialID);
        return res.status(200).json({ success: true });
      }
    }

    return res.status(404).json({ error: "Route not found" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}