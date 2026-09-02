import { verifyRegistrationResponse } from '@simplewebauthn/server';
import db from '../db.js'; // 경로 수정됨

export default async function handler(req, res) {
  try {
    const { body } = req;
    const user = db.users["user123"];
    const expectedChallenge = db.challenges[user.id];

    const verification = await verifyRegistrationResponse({
      response: body.response,
      expectedChallenge,
      expectedOrigin: `https://${req.headers.host}`,
      expectedRPID: req.headers.host.split(':')[0],
    });

    if (verification.verified) {
      const { registrationInfo } = verification;
      user.devices.push({
        credentialID: registrationInfo.credentialID,
        credentialPublicKey: registrationInfo.credentialPublicKey,
        counter: registrationInfo.counter,
        name: body.deviceName || `Device ${user.devices.length + 1}`,
        createdAt: new Date().toISOString()
      });
      delete db.challenges[user.id];
      res.status(200).json({ verified: true });
    }
  } catch (error) {
    console.error("Register Verify Error:", error);
    res.status(400).json({ error: error.message });
  }
}