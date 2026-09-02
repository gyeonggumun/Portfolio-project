import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import db from '../db.js'; // 경로 수정됨
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const SECRET = "super_secret_key_for_assignment"; 

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const { body } = req;
    const user = db.users["user123"];
    const expectedChallenge = db.challenges[user.id];

    if (!expectedChallenge) {
      return res.status(400).json({ error: "Challenge not found or already used." });
    }

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
      device.counter = verification.authenticationInfo.newCounter;
      delete db.challenges[user.id];

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
    console.error("Login Verify Error:", error);
    res.status(400).json({ error: error.message });
  }
}