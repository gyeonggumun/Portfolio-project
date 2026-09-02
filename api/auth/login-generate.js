import { generateAuthenticationOptions } from '@simplewebauthn/server';
import db from '../../db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // 테스트를 위한 하드코딩 유저
  const user = db.users["user123"];
  if (!user) return res.status(404).json({ error: "User not found" });

  const options = await generateAuthenticationOptions({
    rpID: req.headers.host.split(':')[0],
    allowCredentials: user.devices.map(dev => ({
      id: dev.credentialID,
      type: 'public-key',
    })),
    userVerification: 'preferred',
  });

  // 매번 생성되는 새 질문(Challenge)을 저장하여 이후 서명 검증 시 사용
  db.challenges[user.id] = options.challenge;

  res.status(200).json(options);
}