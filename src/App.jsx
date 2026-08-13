import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState(null);
  const detailRef = useRef(null);

  const toggleTab = (index) => {
    if (activeTab === index) {
      // 이미 열려있는 것을 누르면 닫기
      setActiveTab(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // 새로운 탭 열고 부드럽게 아래로 스크롤 이동
      setActiveTab(index);
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100); // 렌더링 후 이동하도록 약간의 지연
    }
  };

  return (
    <div className="portfolio-container">
      
      {/* --- 첫 화면 영역 (스크롤 없이 꽉 차는 100vh 공간) --- */}
      <div className="first-screen">
        <div className="content-wrapper">
          
          {/* 좌측: 프로필 영역 (이미지 추가 이전 기본 버전) */}
          <header className="header-section">
            <div className="profile-card">
              <h3>👨‍💻 기본 정보 및 주요 프로젝트</h3>
              <ul className="info-list">
                <li><strong>이름</strong> 문경구</li>
                <li><strong>이메일</strong> lion989072@gmail.com</li>
                <li><strong>주소</strong> 부산광역시 연제구 *** (상세 비공개)</li>
                <li><strong>연락처</strong> 010-****-9890 (상세 비공개)</li>
                <li><strong>학교</strong> **대학교 컴퓨터 공학과 졸업</li>
                <li className="project-list">
                  <strong>주요 프로젝트</strong> 
                  <p>- AI 학습 대시보드 UI 개발 및 최적화 (React)</p>
                  <p>- 엔터프라이즈 인프라 및 보안 네트워크 구축</p>
                </li>
                <li><strong>GitHub</strong> <a href="https://github.com/gyeonggumun" target="_blank" rel="noreferrer">저장소 바로가기 ↗</a></li>
              </ul>
            </div>
          </header>

          {/* 우측: 핵심 역량 버튼 모음 */}
          <main className="strengths-section">
            <h2>💡 핵심 역량 3가지 (클릭하여 상세 보기)</h2>
            
            <div className="strength-item">
              <button className={`interactive-btn ${activeTab === 1 ? 'active' : ''}`} onClick={() => toggleTab(1)}>
                1. 사용자 경험(UX) 중심의 컴포넌트 최적화
              </button>
            </div>
            <div className="strength-item">
              <button className={`interactive-btn ${activeTab === 2 ? 'active' : ''}`} onClick={() => toggleTab(2)}>
                2. 시각적 균형을 고려한 UI 설계
              </button>
            </div>
            <div className="strength-item">
              <button className={`interactive-btn ${activeTab === 3 ? 'active' : ''}`} onClick={() => toggleTab(3)}>
                3. 안정적인 인프라 및 네트워크 구축
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* --- 클릭 시 하단에 등장하는 전체화면 상세 영역 --- */}
      {activeTab !== null && (
        <div className="full-detail-section" ref={detailRef}>
          <div className="detail-content-box">
            
            {/* 1번 내용 */}
            {activeTab === 1 && (
              <>
                <h2>1. 사용자 경험(UX) 중심의 컴포넌트 최적화</h2>
                <div className="detail-grid">
                  <div className="detail-text">
                    <h3>📌 프로젝트 개요</h3>
                    <p>AI 학습 대시보드를 개발하며 React를 활용하여 사용자 인터페이스를 구축했습니다.</p>
                    
                    <h3>🚀 상황 및 행동 (STAR)</h3>
                    <p>튜터 기본 설정이 복잡하여 사용자가 불편을 겪는 상황을 파악하고, 직관적으로 'Kangaroo'를 기본값으로 변경했습니다. 또한 세션 시간 조정 로직을 독립적인 컴포넌트로 분리하여 리팩토링을 진행했습니다.</p>
                    
                    <h3>💡 결과</h3>
                    <p>코드의 유지보수성이 크게 향상되었고, 실제 사용자가 튜터를 매칭하고 시간을 설정하는 데 걸리는 소요 시간이 눈에 띄게 단축되었습니다.</p>
                  </div>
                  <div className="detail-media">
                    <div className="video-wrapper">
                      {/* 유튜브 영상인 경우 */}
                      <iframe src="https://www.youtube.com/embed/영상ID입력" title="프로젝트 시연" allowFullScreen></iframe>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 2번 내용 */}
            {activeTab === 2 && (
              <>
                <h2>2. 시각적 균형을 고려한 UI 설계</h2>
                <div className="detail-grid">
                  <div className="detail-text">
                    <h3>📌 상황 및 행동</h3>
                    <p>SK 부동산 홍보 지도 및 전단지 제작 과정에서 텍스트와 이모지 배치의 시각적 불균형 문제가 있었습니다. 이를 해결하기 위해 아파트 텍스트를 이모지 왼쪽으로 재배치하는 등 세밀한 UI 조정을 진행했습니다.</p>
                    <h3>💡 결과</h3>
                    <p>화면의 시각적 균형이 개선되어 고객에게 전달되는 정보의 가독성과 전달력이 크게 높아졌습니다.</p>
                    <a href="#" className="evidence-link">공개 가능한 근거: 지도 UI 디자인 결과물 (링크)</a>
                  </div>
                  <div className="detail-media">
                    <div className="video-wrapper">
                       {/* 직접 올린 영상인 경우 (public 폴더) */}
                       {/* <video src="/my-video.mp4" controls></video> */}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 3번 내용 */}
            {activeTab === 3 && (
              <>
                <h2>3. 안정적인 인프라 및 네트워크 구축</h2>
                <div className="detail-grid">
                  <div className="detail-text">
                    <h3>📌 상황 및 행동</h3>
                    <p>서버 인프라 구축 프로젝트 중 Graylog 및 pfSense 방화벽 설정에서 라우팅 및 로그 수집 오류가 발생했습니다. 원인을 분석하여 DNS용 53번 포트를 정확히 할당하고, firewalld의 protocol value 구문 오류를 수정했습니다.</p>
                    <h3>💡 결과</h3>
                    <p>에러가 완전히 해결되어 안정적인 서버 운영 및 보안 관리 자동화 기반을 완성했습니다.</p>
                  </div>
                  <div className="detail-media">
                    <div className="image-placeholder">인프라 구조도 사진을 여기에 넣으세요</div>
                  </div>
                </div>
              </>
            )}

            {/* 닫기 버튼 */}
            <button className="close-btn" onClick={() => {
              setActiveTab(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>
              접기 및 위로 가기 ⬆
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default App;