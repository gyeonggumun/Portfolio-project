// api/auth/register-verify.js
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import db from '../../db.js';

export default async function handler(req, res) {
  const { body } = req;
  const user = db.users["user123"];
  const expectedChallenge = db.challenges[user.id];

  try {
    const verification = await verifyRegistrationResponse({
      response: body.response,
      expectedChallenge,
      expectedOrigin: `https://${req.headers.host}`,
      expectedRPID: req.headers.host.split(':')[0],
    });

    if (verification.verified) {
      const { registrationInfo } = verification;
      // 공개키만 서버에 저장, 개인키는 기기에 남음 (T08-C21, C22, C23)
      user.devices.push({
        credentialID: registrationInfo.credentialID,
        credentialPublicKey: registrationInfo.credentialPublicKey,
        counter: registrationInfo.counter,
        name: body.deviceName || `Device ${user.devices.length + 1}`, // 사람이 알아볼 수 있는 이름 (T08-C24)
        createdAt: new Date().toISOString()
      });
      delete db.challenges[user.id]; // 사용한 질문 폐기
      res.status(200).json({ verified: true });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}