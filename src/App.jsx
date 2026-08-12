import { useState } from 'react';
import './App.css';

function App() {
  // 카드 5: 상호작용 (버튼 클릭 시 상세 내용이 열리고 닫히는 상태)
  const [activeTab, setActiveTab] = useState(null);

  const toggleTab = (index) => {
    setActiveTab(activeTab === index ? null : index);
  };

  return (
    <div className="portfolio-container">
      {/* 카드 1: 대상과 공개 범위 */}
      <header className="header-section">
        <h1>이 페이지는 IT 기업 채용 담당자 및 팀원들에게 저의 프론트엔드 최적화 및 인프라 구축 역량을 보여주기 위한 것입니다.</h1>
        <div className="privacy-info">
          <p><strong>✅ 공개하는 정보:</strong> 포트폴리오용 이름(OOO), 주요 프로젝트 경험, GitHub 주소</p>
          <p><strong>🔒 공개하지 않는 정보:</strong> 실명, 개인 연락처, 거주지 상세 주소</p>
        </div>
      </header>

      {/* 카드 2 & 카드 5: 강점 3가지와 상호작용(아코디언 버튼) */}
      <main className="strengths-section">
        <h2>핵심 역량 3가지 (클릭하여 상세 보기)</h2>
        
        <div className="strength-item">
          <button className="interactive-btn" onClick={() => toggleTab(1)}>
            1. 사용자 경험(UX) 중심의 컴포넌트 최적화
          </button>
          {activeTab === 1 && (
            <div className="strength-detail">
              <p><strong>상황/행동:</strong> AI 학습 대시보드 개발 중, 튜터 기본 설정을 'Kangaroo'로 직관적으로 변경하고 세션 시간 조정 로직을 재구성했습니다.</p>
              <p><strong>결과:</strong> 코드 가독성이 향상되고, 사용자의 매칭 소요 시간이 단축되었습니다.</p>
            </div>
          )}
        </div>

        <div className="strength-item">
          <button className="interactive-btn" onClick={() => toggleTab(2)}>
            2. 시각적 균형을 고려한 UI 설계
          </button>
          {activeTab === 2 && (
            <div className="strength-detail">
              <p><strong>상황/행동:</strong> SK 부동산 홍보 지도 제작 시, 아파트 텍스트를 이모지 왼쪽으로 재배치하는 세밀한 UI 조정을 진행했습니다.</p>
              <p><strong>결과:</strong> 화면의 시각적 균형이 개선되어 정보 전달력이 높아졌습니다.</p>
              <a href="#" className="evidence-link">공개 가능한 근거: 지도 UI 디자인 결과물 (링크)</a>
            </div>
          )}
        </div>

        <div className="strength-item">
          <button className="interactive-btn" onClick={() => toggleTab(3)}>
            3. 안정적인 인프라 및 네트워크 구축
          </button>
          {activeTab === 3 && (
            <div className="strength-detail">
              <p><strong>상황/행동:</strong> Graylog 및 pfSense 방화벽 설정 중, DNS용 53번 포트를 정확히 할당하고 firewalld의 protocol value와 firewall-cmd 구문 오류를 해결했습니다.</p>
              <p><strong>결과:</strong> 로그 수집 및 라우팅 에러가 해결되어 안정적인 서버 인프라 환경을 완성했습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;