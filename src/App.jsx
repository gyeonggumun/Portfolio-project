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
                <p>- 엔터프라이즈 인프라 및 보안 네트워크 구축 (pfSense, Graylog)</p>
                <p>- DB Master-Slave 서버 연동 및 모니터링 구축</p>
                <p>- SellScript 개발을 통한 서버 운영 자동화</p>
                <p>- AI 학습 대시보드 UI 개발 및 최적화 (React)</p>
                <p>- 양조장 체험 및 술 판매 페이지 UI/UX 개발 및 최적화 (React)</p>
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
                1. '아무도 믿지 않는다' 철통 보안 사내 서버 및 인프라 설계
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
                <h2>1. '아무도 믿지 않는다' 철통 보안 사내 서버 및 인프라 설계 (Gray Guard)</h2>
                
                <div className="detail-grid">
                  {/* 좌측: 상세 텍스트 설명 */}
                  <div className="detail-text">
                    <h3>📌 프로젝트 목표</h3>
                    <p>기업 내부망의 논리적 망분리(VLAN) 및 DMZ 구성을 통해 외부 위협을 격리하고, 접근통제(ACL)와 중앙 로그 수집(Graylog)을 적용하여 가시성과 추적성을 확보한 안전한 서버 인프라를 설계 및 구축하는 것입니다.</p>
                    
                    <h3>🛠️ 기술 스택</h3>
                    <p>
                      <strong>OS/Network:</strong> Rocky Linux, pfSense (Firewall, VLAN, ACL), OpenSSH<br/>
                      <strong>DB/Service:</strong> MariaDB, Apache, BIND9 (DNS)<br/>
                      <strong>Security/Log:</strong> Graylog, rsyslog (TLS Encryption)
                    </p>

                    <h3>🚀 역할 및 시도</h3>
                    <p>
                      <strong>서버 인프라 구축 및 보안 하드닝 담당</strong><br/>
                      - <strong>DB 가용성 및 접근 제어:</strong> MariaDB Master-Slave 복제(Replication) 아키텍처를 구축하여 부하를 분산하고, 3306 포트는 DMZ의 Web 서버와 내부 Log 서버에서만 접근하도록 통제했습니다.<br/>
                      - <strong>시스템 보안 강화:</strong> 패스워드 복잡도(pwquality) 및 로그인 실패 잠금(faillock) 정책을 적용하고, SSH 접속 시 root 직접 로그인을 차단(PermitRootLogin no)하여 원격 보안을 강화했습니다.<br/>
                      - <strong>안전한 파일 전송:</strong> SFTP 전용망을 구축하고 부서별 계정에 `chroot` 격리 및 nologin 쉘을 적용하여 비인가 디렉터리 탐색을 원천 차단했습니다.
                    </p>
                    
                    <h3>💡 직면한 과제와 핵심 교훈</h3>
                    <p>
                      <strong>과제:</strong> 다수의 서버(Web, DB, DNS, SFTP)에서 발생하는 로그가 파편화되어 침해 사고 발생 시 신속한 원인 분석이 어려웠고, 로그 평문 전송 시 네트워크 스니핑 위협이 존재했습니다.<br/>
                      <strong>해결 및 교훈:</strong> rsyslog를 활용해 각 서버의 로그를 TLS로 암호화하여 Graylog 중앙 서버로 안전하게 전송 및 수집하도록 아키텍처를 개선했습니다. 이 과정을 통해 인프라 설계 시 '네트워크 논리적 격리'만큼이나 '데이터 전송 간 암호화'와 '로그 가시성 확보'가 방어의 핵심 지주임을 깊이 체감했습니다. 더불어 MariaDB 이중화를 직접 구현하며 데이터 무결성 유지의 중요성을 배웠습니다.
                    </p>
                  </div>
                  
                  {/* 우측: 2개의 유튜브 영상 직접 재생 및 외부 링크 버튼 */}
                  <div className="detail-media">
                    <h3 style={{ fontSize: '1.2rem', color: '#93c5fd', marginTop: 0, marginBottom: '1rem' }}>
                      ▶ 핵심 기능 시연 영상
                    </h3>
                    
                    {/* --- 첫 번째 영상 세트 --- */}
                    <div style={{ marginBottom: '2.5rem' }}>
                      <div className="video-wrapper" style={{ marginBottom: '0.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
                        <iframe 
                          src="https://www.youtube.com/embed/Go_emZm931w"
                          title="보안 인프라 시연 영상 1" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                      <a href="https://youtu.be/Go_emZm931w" target="_blank" rel="noreferrer" className="evidence-link" style={{ display: 'block', textAlign: 'center', margin: 0 }}>
                        🔗 유튜브에서 영상 1 보기 ↗
                      </a>
                    </div>

                    {/* --- 두 번째 영상 세트 --- */}
                    <div>
                      <div className="video-wrapper" style={{ marginBottom: '0.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
                        <iframe 
                          src="https://www.youtube.com/embed/Q9JLCOQBatk" 
                          title="보안 인프라 시연 영상 2" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                      <a href="https://youtu.be/Q9JLCOQBatk" target="_blank" rel="noreferrer" className="evidence-link" style={{ display: 'block', textAlign: 'center', margin: 0, backgroundColor: '#475569' }}>
                        🔗 유튜브에서 영상 2 보기 ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* 하단: 추가 시각 자료 및 이미지 갤러리 */}
                <div style={{ marginTop: '2rem', borderTop: '1px solid #475569', paddingTop: '2rem' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#93c5fd', marginBottom: '1.5rem' }}>📸 아키텍처 및 상세 구현 화면</h3>
                  
                  {/* 이미지가 2개씩 3줄로 고정 배열되는 그리드 */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                    
                    {/* 이미지 1 (아키텍처) */}
                    <div className="gallery-item">
                      <img 
                        src="/architecture.png" 
                        alt="통합 기업 네트워크 및 보안 시스템 구성도" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ 통합 기업 네트워크 및 보안 시스템 구성도
                      </p>
                    </div>

                    {/* 이미지 2 */}
                    <div className="gallery-item">
                      <img 
                        src="/image2.png" 
                        alt="추가 보안 구현 화면 2" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ 이미지 2에 대한 한 줄 설명을 여기에 적어주세요.
                      </p>
                    </div>

                    {/* 이미지 3 */}
                    <div className="gallery-item">
                      <img 
                        src="/image3.png" 
                        alt="추가 보안 구현 화면 3" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ 이미지 3에 대한 한 줄 설명을 여기에 적어주세요.
                      </p>
                    </div>

                    {/* 이미지 4 */}
                    <div className="gallery-item">
                      <img 
                        src="/image4.png" 
                        alt="추가 보안 구현 화면 4" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ 이미지 4에 대한 한 줄 설명을 여기에 적어주세요.
                      </p>
                    </div>

                    {/* 이미지 5 */}
                    <div className="gallery-item">
                      <img 
                        src="/image5.png" 
                        alt="추가 보안 구현 화면 5" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ 이미지 5에 대한 한 줄 설명을 여기에 적어주세요.
                      </p>
                    </div>

                    {/* 이미지 6 */}
                    <div className="gallery-item">
                      <img 
                        src="/image6.png" 
                        alt="추가 보안 구현 화면 6" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ 이미지 6에 대한 한 줄 설명을 여기에 적어주세요.
                      </p>
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