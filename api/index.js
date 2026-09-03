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
  if (options.maxAge !== undefined) {
    str += `; Max-Age=${options.maxAge}`;
    // 완벽한 쿠키 삭제를 위해 만료일을 과거로 덮어쓰기
    if (options.maxAge <= 0) str += `; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
  if (options.path) str += `; Path=${options.path}`;
  if (options.httpOnly) str += `; HttpOnly`;
  if (options.secure) str += `; Secure`;
  if (options.sameSite) str += `; SameSite=${options.sameSite}`;
  return str;
};

const getDevices = (cookies) => {
  if (!cookies.auth_db_devices) return [];
  try {
    const json = Buffer.from(cookies.auth_db_devices, 'base64').toString('utf-8');
    return JSON.parse(json).map(d => ({
      ...d,
      credentialPublicKey: new Uint8Array(Buffer.from(d.credentialPublicKey, 'base64'))
    }));
  } catch (e) {
    return [];
  }
};

const createDeviceCookie = (devices) => {
  const plainDevices = devices.map(d => ({
    ...d,
    credentialPublicKey: Buffer.from(d.credentialPublicKey).toString('base64')
  }));
  const json = JSON.stringify(plainDevices);
  const b64 = Buffer.from(json).toString('base64');
  return serializeCookie('auth_db_devices', b64, { httpOnly: true, secure: true, path: '/', maxAge: 60 * 60 * 24 * 365 });
};

export default async function handler(req, res) {
  const { action } = req.query;
  const rpid = req.headers.host.split(':')[0];
  const expectedOrigin = `https://${req.headers.host}`;
  const cookies = parseCookies(req.headers.cookie);
  
  const user = { id: "user123", username: "testuser", devices: getDevices(cookies) };

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
        user.devices.push({
          credentialID: regInfo.credential?.id || regInfo.credentialID,
          credentialPublicKey: regInfo.credential?.publicKey || regInfo.credentialPublicKey,
          counter: regInfo.credential?.counter || regInfo.counter || 0,
          name: req.body.deviceName || `Device ${user.devices.length + 1}`,
          createdAt: new Date().toISOString()
        });
        
        res.setHeader('Set-Cookie', [
          serializeCookie('auth_challenge', '', { maxAge: 0, path: '/' }),
          createDeviceCookie(user.devices) 
        ]);
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
        device.counter = verification.authenticationInfo.newCounter;
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });

        res.setHeader('Set-Cookie', [
          serializeCookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' }),
          serializeCookie('auth_challenge', '', { maxAge: 0, path: '/' }),
          createDeviceCookie(user.devices) 
        ]);
        return res.status(200).json({ verified: true });
      }
    }

    if (action === 'logout') {
      // 보안 옵션까지 완벽히 일치시켜야 브라우저가 쿠키를 삭제함
      res.setHeader('Set-Cookie', serializeCookie('auth_token', '', { maxAge: 0, path: '/', httpOnly: true, secure: true, sameSite: 'strict' }));
      return res.status(200).json({ success: true });
    }

    if (action === 'private-data') {
      const token = cookies.auth_token;
      if (!token) return res.status(401).json({ error: "Unauthorized" });
      jwt.verify(token, SECRET);
      return res.status(200).json([
        { id: 1, title: "준비 중인 프로젝트 메모", content: "React 19 마이그레이션 및 WebAuthn 도입" },
        { id: 2, title: "지원하려는 곳 목록", content: "SKT K-뉴딜, 프론트엔드 직무" },
        { id: 3, title: "스스로 쓰는 회고", content: "서버리스 환경의 한계를 쿠키 DB로 완벽히 해결함!" }
      ]);
    }

    if (action === 'passkeys') {
      const token = cookies.auth_token;
      if (!token) return res.status(401).json({ error: "Unauthorized" });
      jwt.verify(token, SECRET);

      if (req.method === 'GET') {
        return res.status(200).json(user.devices.map(d => ({ credentialID: d.credentialID, name: d.name, createdAt: d.createdAt })));
      }
      
      if (req.method === 'DELETE') {
        user.devices = user.devices.filter(d => d.credentialID !== req.body.credentialID);
        
        const setCookies = [createDeviceCookie(user.devices)];
        // 기기를 전부 지웠다면 토큰도 파기하여 강제 로그아웃 처리
        if (user.devices.length === 0) {
          setCookies.push(serializeCookie('auth_token', '', { maxAge: 0, path: '/', httpOnly: true, secure: true, sameSite: 'strict' }));
        }
        
        res.setHeader('Set-Cookie', setCookies);
        return res.status(200).json({ success: true, isLogOut: user.devices.length === 0 });
      }
    }

    return res.status(404).json({ error: "Route not found" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}