// api/db.js
if (!global.db) {
  global.db = {
    users: {
      "user123": {
        id: "user123",
        username: "testuser",
        devices: [] // 패스키(공개키)가 여러 개 저장될 배열 (카드 4 충족)
      }
    },
    challenges: {} // 일회용 질문(Challenge)을 임시 보관할 객체
  };
}
export default global.db;