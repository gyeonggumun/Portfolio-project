// api/private/data.js (비공개 자료 직접 요청 차단 로직)
import jwt from 'jsonwebtoken';

const SECRET = "super_secret_key_for_assignment";

export default function handler(req, res) {
  const token = req.cookies?.auth_token;

  // 패스키로 들어가지 않은 상태에서 직접 요청 시 401/403 거절 (T08-C16, C17)
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Passkey login required." });
  }

  try {
    jwt.verify(token, SECRET);
    // T08-C14: 비공개 영역 항목 3개 이상 반환
    res.status(200).json([
      { id: 1, title: "준비 중인 프로젝트 메모", content: "React 19 마이그레이션 및 WebAuthn 도입 회고" },
      { id: 2, title: "지원하려는 곳 목록", content: "A사(프론트엔드), B사(풀스택)" },
      { id: 3, title: "스스로 쓰는 회고", content: "비밀번호 없는 로그인의 편리함과 보안성에 대해 고민함." }
    ]);
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
}