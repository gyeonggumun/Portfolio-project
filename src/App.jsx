import { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState(null);

  const toggleTab = (index) => {
    setActiveTab(activeTab === index ? null : index);
  };

  return (
    <div className="portfolio-container">
      {/* 프로필 및 마스킹된 개인정보 영역 */}
      <header className="header-section">
        <h1>이 페이지는 IT 기업 채용 담당자 및 팀원들에게 저의 프론트엔드 최적화 및 인프라 구축 역량을 보여주기 위한 것입니다.</h1>
        
        <div className="profile-card">
          <h3>기본 정보 및 프로젝트</h3>
          <ul className="info-list">
            <li><strong>이름:</strong> 문경구</li>
            <li><strong>주소:</strong> 부산광역시 연제구 *** (상세주소 비공개)</li>
            <li><strong>연락처:</strong> 010-****-9890</li>
            <li><strong>학교:</strong> **대학교 컴퓨터 공학과 졸업</li>
            <li><strong>주요 프로젝트:</strong> 
              <br/>- AI 학습 대시보드 UI 개발 및 최적화 (React)
              <br/>- 엔터프라이즈 인프라 및 보안 네트워크 구축 (pfSense, Graylog)
              <br/>- DB Master-Slave 서버 연동 및 PMM 기반 데이터베이스 모니터링 환경 구축
              <br/>- SellScript 개발을 통한 서버 운영 및 보안 관리 자동화
              <br/>- 악성코드 분석 환경 구축 및 샘플 기반 행위 분석·탐지 실습
            </li>
            <li><strong>GitHub:</strong> <a href="https://github.com/gyeonggumun" target="_blank" rel="noreferrer">깃 허브 바로가기</a></li>
          </ul>
        </div>
      </header>

      {/* 핵심 역량 3가지 및 상호작용(아코디언 버튼) */}
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