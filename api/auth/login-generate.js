import { generateAuthenticationOptions } from '@simplewebauthn/server';
import db from '../db.js'; // 경로 수정됨

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
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

    db.challenges[user.id] = options.challenge;
    res.status(200).json(options);
  } catch (error) {
    console.error("Login Generate Error:", error);
    res.status(500).json({ error: error.message });
  }
}