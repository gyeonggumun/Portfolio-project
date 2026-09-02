import { 
  generateRegistrationOptions, verifyRegistrationResponse, 
  generateAuthenticationOptions, verifyAuthenticationResponse 
} from '@simplewebauthn/server';
import jwt from 'jsonwebtoken';

const SECRET = "super_secret_key_for_assignment";

const parseCookies = (cookieStr) => {
  if (!cookieStr) return {};
  return cookieStr.split(';').reduce((acc, curr) => {
    const [key, value] = curr.trim().split('=');
    if (key) acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
};

const serializeCookie = (name, value, options = {}) => {
  let str = `${name}=${encodeURIComponent(value)}`;
  if (options.maxAge !== undefined) str += `; Max-Age=${options.maxAge}`;
  if (options.path) str += `; Path=${options.path}`;
  if (options.httpOnly) str += `; HttpOnly`;
  if (options.secure) str += `; Secure`;
  if (options.sameSite) str += `; SameSite=${options.sameSite}`;
  return str;
};

if (!global.db) {
  global.db = {
    users: { "user123": { id: "user123", username: "testuser", devices: [] } }
  };
}

export default async function handler(req, res) {
  const { action } = req.query;
  const user = global.db.users["user123"];
  const rpid = req.headers.host.split(':')[0];
  const expectedOrigin = `https://${req.headers.host}`;
  const cookies = parseCookies(req.headers.cookie);

  try {
    if (action === 'register-generate') {
      const options = await generateRegistrationOptions({
        rpName: 'My Portfolio',
        rpID: rpid,
        userID: new Uint8Array(Buffer.from(user.id)),
        userName: user.username,
        attestationType: 'none',
        excludeCredentials: user.devices.map(dev => ({ id: dev.credentialID, type: 'public-key' })),
      });
      res.setHeader('Set-Cookie', serializeCookie('auth_challenge', options.challenge, { httpOnly: true, secure: true, path: '/' }));
      return res.status(200).json(options);
    }

    if (action === 'register-verify') {
      const expectedChallenge = cookies.auth_challenge;
      if (!expectedChallenge) return res.status(400).json({ error: "Challenge cookie not found" });

      const verification = await verifyRegistrationResponse({
        response: req.body.response, expectedChallenge, expectedOrigin, expectedRPID: rpid,
      });

      if (verification.verified) {
        const regInfo = verification.registrationInfo;
        // 라이브러리 v9 및 v10+ 모든 버전에 호환되도록 안전한 추출
        const credentialID = regInfo.credential?.id || regInfo.credentialID;
        const credentialPublicKey = regInfo.credential?.publicKey || regInfo.credentialPublicKey;
        const counter = regInfo.credential?.counter || regInfo.counter || 0;

        user.devices.push({
          credentialID,
          credentialPublicKey,
          counter,
          name: req.body.deviceName || `Device ${user.devices.length + 1}`,
          createdAt: new Date().toISOString()
        });
        res.setHeader('Set-Cookie', serializeCookie('auth_challenge', '', { maxAge: -1, path: '/' }));
        return res.status(200).json({ verified: true });
      }
    }

    if (action === 'login-generate') {
      const options = await generateAuthenticationOptions({
        rpID: rpid,
        allowCredentials: user.devices.map(dev => ({ id: dev.credentialID, type: 'public-key' })),
        userVerification: 'preferred',
      });
      res.setHeader('Set-Cookie', serializeCookie('auth_challenge', options.challenge, { httpOnly: true, secure: true, path: '/' }));
      return res.status(200).json(options);
    }

    if (action === 'login-verify') {
      const expectedChallenge = cookies.auth_challenge;
      if (!expectedChallenge) return res.status(400).json({ error: "Challenge cookie not found" });

      const device = user.devices.find(dev => dev.credentialID === req.body.id);
      if (!device) return res.status(400).json({ error: "Device not registered" });

      const verification = await verifyAuthenticationResponse({
        response: req.body, expectedChallenge, expectedOrigin, expectedRPID: rpid,
        authenticator: { credentialPublicKey: device.credentialPublicKey, credentialID: device.credentialID, counter: device.counter },
        credential: { publicKey: device.credentialPublicKey, id: device.credentialID, counter: device.counter },
      });

      if (verification.verified) {
        const authInfo = verification.authenticationInfo;
        device.counter = authInfo.newCounter;
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });

        res.setHeader('Set-Cookie', [
          serializeCookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' }),
          serializeCookie('auth_challenge', '', { maxAge: -1, path: '/' })
        ]);
        return res.status(200).json({ verified: true });
      }
    }

    if (action === 'logout') {
      res.setHeader('Set-Cookie', serializeCookie('auth_token', '', { maxAge: -1, path: '/' }));
      return res.status(200).json({ success: true });
    }

    if (action === 'private-data') {
      const token = cookies.auth_token;
      if (!token) return res.status(401).json({ error: "Unauthorized" });
      jwt.verify(token, SECRET);
      return res.status(200).json([
        { id: 1, title: "준비 중인 프로젝트 메모", content: "React 19 마이그레이션 및 WebAuthn 도입" },
        { id: 2, title: "지원하려는 곳 목록", content: "SKT K-뉴딜, 프론트엔드 직무" },
        { id: 3, title: "스스로 쓰는 회고", content: "서버리스 환경의 에러를 완벽히 해결함" }
      ]);
    }

    if (action === 'passkeys') {
      const token = cookies.auth_token;
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
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}