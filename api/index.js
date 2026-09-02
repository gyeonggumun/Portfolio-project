import { 
  generateRegistrationOptions, verifyRegistrationResponse, 
  generateAuthenticationOptions, verifyAuthenticationResponse 
} from '@simplewebauthn/server';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie'; // 500 에러 해결: import 문법 수정

const SECRET = "super_secret_key_for_assignment";

// 유저 데이터와 패스키는 과제 제출용으로 임시 유지
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

  // 쿠키 수동 파싱 (Vercel 기본 파서 호환성 보장)
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};

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
      // 400 에러 해결: Challenge를 서버 메모리가 아닌 쿠키에 안전하게 저장
      res.setHeader('Set-Cookie', cookie.serialize('auth_challenge', options.challenge, { httpOnly: true, secure: true, path: '/' }));
      return res.status(200).json(options);
    }

    if (action === 'register-verify') {
      const expectedChallenge = cookies.auth_challenge;
      if (!expectedChallenge) return res.status(400).json({ error: "Challenge cookie not found" });

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
        // 인증 성공 시 사용한 Challenge 쿠키 삭제
        res.setHeader('Set-Cookie', cookie.serialize('auth_challenge', '', { maxAge: -1, path: '/' }));
        return res.status(200).json({ verified: true });
      }
    }

    if (action === 'login-generate') {
      const options = await generateAuthenticationOptions({
        rpID: rpid,
        allowCredentials: user.devices.map(dev => ({ id: dev.credentialID, type: 'public-key' })),
        userVerification: 'preferred',
      });
      res.setHeader('Set-Cookie', cookie.serialize('auth_challenge', options.challenge, { httpOnly: true, secure: true, path: '/' }));
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
      });

      if (verification.verified) {
        device.counter = verification.authenticationInfo.newCounter;
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
        
        // JWT 토큰 발급 및 Challenge 쿠키 동시 삭제
        res.setHeader('Set-Cookie', [
          cookie.serialize('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' }),
          cookie.serialize('auth_challenge', '', { maxAge: -1, path: '/' })
        ]);
        return res.status(200).json({ verified: true });
      }
    }

    if (action === 'logout') {
      res.setHeader('Set-Cookie', cookie.serialize('auth_token', '', { maxAge: -1, path: '/' }));
      return res.status(200).json({ success: true });
    }

    if (action === 'private-data') {
      const token = cookies.auth_token;
      if (!token) return res.status(401).json({ error: "Unauthorized" });
      jwt.verify(token, SECRET);
      return res.status(200).json([
        { id: 1, title: "준비 중인 프로젝트 메모", content: "React 19 마이그레이션 및 WebAuthn 도입" },
        { id: 2, title: "지원하려는 곳 목록", content: "SKT K-뉴딜, 프론트엔드 직무" },
        { id: 3, title: "스스로 쓰는 회고", content: "서버리스 환경의 상태 관리를 쿠키로 해결함" }
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