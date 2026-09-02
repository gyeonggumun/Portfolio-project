import { generateRegistrationOptions } from '@simplewebauthn/server';
import db from '../db.js'; // 경로 수정됨

export default async function handler(req, res) {
  try {
    const user = db.users["user123"];
    
    const options = await generateRegistrationOptions({
      rpName: 'My Portfolio',
      rpID: req.headers.host.split(':')[0],
      userID: new TextEncoder().encode(user.id), // 최신 버전 필수 문법 반영
      userName: user.username,
      attestationType: 'none',
      excludeCredentials: user.devices.map(dev => ({
        id: dev.credentialID,
        type: 'public-key',
      })),
    });

    db.challenges[user.id] = options.challenge;
    res.status(200).json(options);
  } catch (error) {
    console.error("Register Generate Error:", error);
    res.status(500).json({ error: error.message });
  }
}