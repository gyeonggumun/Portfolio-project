import jwt from 'jsonwebtoken';
import db from '../db.js'; // 경로 수정됨

const SECRET = "super_secret_key_for_assignment";

export default function handler(req, res) {
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET);
    const user = db.users[decoded.id];

    if (req.method === 'GET') {
      const safeDevices = user.devices.map(d => ({
        credentialID: d.credentialID,
        name: d.name,
        createdAt: d.createdAt
      }));
      res.status(200).json(safeDevices);
      
    } else if (req.method === 'DELETE') {
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