import jwt from 'jsonwebtoken';
import db from '../../db.js';

const SECRET = "super_secret_key_for_assignment";

export default function handler(req, res) {
  // 쿠키 기반 JWT 인증
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET);
    const user = db.users[decoded.id];

    if (req.method === 'GET') {
      // T08-C43: 민감한 공개키 원본은 제외하고 목록 반환
      const safeDevices = user.devices.map(d => ({
        credentialID: d.credentialID,
        name: d.name,
        createdAt: d.createdAt
      }));
      res.status(200).json(safeDevices);
      
    } else if (req.method === 'DELETE') {
      // T08-C44: 특정 패스키 삭제 로직
      const { credentialID } = req.body;
      user.devices = user.devices.filter(d => d.credentialID !== credentialID);
      res.status(200).json({ success: true });
      
    } else {
      res.status(405).end();
    }
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
}