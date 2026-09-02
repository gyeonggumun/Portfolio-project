import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import db from '../../db.js';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const SECRET = "super_secret_key_for_assignment"; 

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { body } = req;
  const user = db.users["user123"];
  const expectedChallenge = db.challenges[user.id];

  // T08-C31: 이미 사용되었거나 없는 질문에 대한 요청 차단 (Replay Attack 방지)
  if (!expectedChallenge) {
    return res.status(400).json({ error: "Challenge not found or already used." });
  }

  try {
    // 요청에 사용된 기기 정보 찾기
    const device = user.devices.find(dev => dev.credentialID === body.id);
    if (!device) return res.status(400).json({ error: "Device not registered" });

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: `https://${req.headers.host}`,
      expectedRPID: req.headers.host.split(':')[0],
      authenticator: {
        credentialPublicKey: device.credentialPublicKey,
        credentialID: device.credentialID,
        counter: device.counter,
      },
    });

    if (verification.verified) {
      const { authenticationInfo } = verification;
      // 기기 카운터 업데이트
      device.counter = authenticationInfo.newCounter;
      
      // 검증이 끝난 질문(Challenge)은 파기하여 재사용 불가능하게 만듦
      delete db.challenges[user.id];

      // JWT 발급 (HttpOnly 쿠키로 브라우저에 저장)
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
      res.setHeader('Set-Cookie', serialize('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      }));

      res.status(200).json({ verified: true });
    } else {
      res.status(400).json({ error: "Verification failed" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}