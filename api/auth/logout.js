import { serialize } from 'cookie';

export default function handler(req, res) {
  // auth_token 쿠키의 만료일을 과거로 설정하여 즉시 삭제
  res.setHeader('Set-Cookie', serialize('auth_token', '', {
    maxAge: -1,
    path: '/',
  }));
  res.status(200).json({ success: true });
}