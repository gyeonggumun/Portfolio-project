// api/auth/register-generate.js
import { generateRegistrationOptions } from '@simplewebauthn/server';
import db from '../../db.js';

export default async function handler(req, res) {
  const user = db.users["user123"]; // 과제용 단일 유저 하드코딩
  
  const options = await generateRegistrationOptions({
    rpName: 'My Portfolio',
    rpID: req.headers.host.split(':')[0], // Vercel 도메인 자동 인식
    userID: user.id,
    userName: user.username,
    attestationType: 'none',
    excludeCredentials: user.devices.map(dev => ({
      id: dev.credentialID,
      type: 'public-key',
    })),
  });

  // 질문(Challenge) 값을 서버에 보관 (T08-C19)
  db.challenges[user.id] = options.challenge;
  
  res.status(200).json(options);
}