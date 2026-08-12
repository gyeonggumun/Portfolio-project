import './index.css';

function App() {
  return (
    <div className="container">
      {/* 1. 대상 문장 */}
      <section className="core-element">
        <h2>이 페이지는 AI활용 포토폴리오 기본 페이지 입니다.</h2>
      </section>

      {/* 2. 공개 / 비공개 범위 화면 노출 */}
      <section className="core-element">
        <div style={{ display: 'flex', gap: '50px', justifyContent: 'center', textAlign: 'left' }}>
          <div>
            <h3>✅ 공개하는 정보</h3>
            <ul>
              <li>이름 : 문경구</li>
              <li>주요 프로젝트 경험 (AI 대시보드 등)</li>
              <li>GitHub 주소 및 보유 기술</li>
            </ul>
          </div>
          <div>
            <h3>🔒 공개하지 않는 정보</h3>
            <ul>
              <li>실명 및 얼굴 사진</li>
              <li>개인 연락처 (전화번호)</li>
              <li>상세 거주지 주소</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;