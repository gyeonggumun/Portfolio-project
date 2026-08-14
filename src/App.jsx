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
                2. 호텔 통합 보안 진단 및 위협 모델링 (SafeStay)
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
                        src="/public/p1-1.png" 
                        alt="네트워크 및 보안 시스템 구성도" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ 네트워크 및 보안 시스템 구성도
                      </p>
                    </div>

                    {/* 이미지 2 */}
                    <div className="gallery-item">
                      <img 
                        src="/public/p1-2.jpg" 
                        alt="패킷 트레이서 구성도" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ 패킷 트레이서 구성도
                      </p>
                    </div>

                    {/* 이미지 3 */}
                    <div className="gallery-item">
                      <img 
                        src="/public/p1-3.jpg" 
                        alt="각 서버의 로그가 Log서버에 정상 수집되어 저장 중임을 확인" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ 각 서버의 로그가 Log서버에 정상 수집되어 저장 중임을 확인
                      </p>
                    </div>

                    {/* 이미지 4 */}
                    <div className="gallery-item">
                      <img 
                        src="/public/p1-4.jpg" 
                        alt="서비스별 로그를 분리 저장해 추적 효율성 향상" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ 서비스별 로그를 분리 저장해 추적 효율성 향상
                      </p>
                    </div>

                    {/* 이미지 5 */}
                    <div className="gallery-item">
                      <img 
                        src="/public/p1-5.jpg" 
                        alt="Log서버 설정 인증서 로그 원본을 3종 분리 백업 장애 복구 및 감사 대응 기능" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ Log서버 설정 인증서 로그 원본을 3종 분리 백업 장애 복구 및 감사 대응 기능
                      </p>
                    </div>

                    {/* 이미지 6 */}
                    <div className="gallery-item">
                      <img 
                        src="/public/p1-6.jpg" 
                        alt="10분마다 자동 헬스체크 수행 서비스 장애를 조기에 감지하는 운영자동화 구현" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ 10분마다 자동 헬스체크 수행 서비스 장애를 조기에 감지하는 운영자동화 구현
                      </p>
                    </div>

                  </div>
                </div>
              </>
            )}

            {/* 2번 내용 */}
            {activeTab === 2 && (
              <>
                <h2>2. 호텔 통합 보안 진단 및 위협 모델링 (SafeStay)</h2>
                
                <div className="detail-grid">
                  {/* 좌측: 상세 텍스트 설명 */}
                  <div className="detail-text">
                    <h3>📌 프로젝트 목표</h3>
                    <p>호텔 예약 시스템(SafeStay)을 외부 공격으로부터 안전하게 보호하기 위해 VLAN 네트워크 분리와 WAF, IDS/IPS를 결합한 다계층 심층 방어 아키텍처를 구축하는 것입니다.</p>
                    
                    <h3>🛠️ 기술 스택</h3>
                    <p>
                      <strong>OS/Network:</strong> Ubuntu 24.04, pfSense (VPN/방화벽), GNS3<br/>
                      <strong>DB/Service:</strong> MariaDB, Nginx<br/>
                      <strong>Security/Log:</strong> Suricata (IDS/IPS), ModSecurity (WAF), Graylog, GoAccess, PMM, Shell Script
                    </p>

                    <h3>🚀 역할 및 시도</h3>
                    <p>
                      <strong>DB/PMM/Shell Script 구축 및 악성코드 분석 담당</strong><br/>
                      - <strong>DB 가용성 및 성능 모니터링:</strong> 가벼운 읽기 작업 처리에 적합한 MariaDB를 도입하고, Slave 서버 구성을 통해 장애 감지 및 이중화 환경을 구축했습니다. 또한 PMM(Percona Monitoring and Management) 서버를 작성하여 DB 성능을 실시간 모니터링했습니다.<br/>
                      - <strong>악성 파일 방어 기제 구현:</strong> 파일명이나 확장자만으로 신뢰하지 않고, 서버 측에서 MIME 검사와 Magic Number 교차 검증을 수행하도록 로직을 구현했습니다. PHP/JSP 등 실행 파일의 업로드를 차단하고, 업로드된 파일은 웹 루트 외부 비실행 경로에 격리 저장했습니다.<br/>
                      - <strong>보안 자동화:</strong> 쉘 스크립트를 작성하여 KISA 기준 취약점(U-01~U-67)을 자동 진단하고 주요 파일·로그 권한 취약점을 자동 조치하도록 구현했습니다.
                    </p>
                    
                    <h3>💡 직면한 과제와 핵심 교훈</h3>
                    <p>
                      <strong>과제:</strong> 제한된 하드웨어 리소스 내에서 실시간 패킷 심층 분석과 악성코드 정적 분석을 수행해야 했으며, 단일 보안 솔루션만으로는 우회 공격에 취약했습니다.<br/>
                      <strong>해결 및 교훈:</strong> 성능 테스트를 통해 멀티스레딩 지원이 우수한 Suricata를 IDS/IPS로 채택하고, ModSecurity WAF와 결합하여 외부 진입 경로와 웹 공격을 다계층으로 통제했습니다. OS Command Injection 및 Slowloris DoS 공격 시나리오를 직접 검증하며 방어 체계의 실효성을 확인했습니다. 이를 통해 단일 방어가 아닌 심층 방어(Defense in Depth) 전략의 중요성과, Suricata/WAF/방화벽 로그를 Graylog로 중앙 수집하여 통합 관제하는 체계의 필수성을 배웠습니다.
                    </p>
                  </div>
                  
                  {/* 우측: 2개의 유튜브 영상 직접 재생 및 외부 링크 버튼 */}
                  <div className="detail-media">
                    <h3 style={{ fontSize: '1.2rem', color: '#93c5fd', marginTop: 0, marginBottom: '1rem' }}>
                      ▶ 핵심 기능 및 공격 방어 시연 영상
                    </h3>
                    
                    {/* --- 첫 번째 영상 세트 --- */}
                    <div style={{ marginBottom: '2.5rem' }}>
                      <div className="video-wrapper" style={{ marginBottom: '0.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
                        <iframe 
                          src="https://www.youtube.com/embed/s6fb6bkrD3I"
                          title="호텔 예약 시스템 웹 시연 " 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                      <a href="https://youtu.be/s6fb6bkrD3I" target="_blank" rel="noreferrer" className="evidence-link" style={{ display: 'block', textAlign: 'center', margin: 0 }}>
                        🔗 유튜브에서 영상 확인 ↗
                      </a>
                    </div>

                    {/* --- 두 번째 영상 세트 --- */}
                    <div>
                      <div className="video-wrapper" style={{ marginBottom: '0.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
                        <iframe 
                          src="https://www.youtube.com/embed/usLNwz1baw0" 
                          title="Slowloris_공격_탐지" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                      <a href="https://youtu.be/usLNwz1baw0" target="_blank" rel="noreferrer" className="evidence-link" style={{ display: 'block', textAlign: 'center', margin: 0, backgroundColor: '#475569' }}>
                        🔗 유튜브에서 영상 확인 ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* 하단: 추가 시각 자료 및 이미지 갤러리 */}
                <div style={{ marginTop: '2rem', borderTop: '1px solid #475569', paddingTop: '2rem' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#93c5fd', marginBottom: '1.5rem' }}>📸 보안 아키텍처 및 검증 화면</h3>
                  
                  {/* 이미지가 2개씩 3줄로 고정 배열되는 그리드 */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                    
                    {/* 이미지 1 (네트워크 구성) */}
                    <div className="gallery-item">
                      <img 
                        src="/public/p2-1.png" 
                        alt="호텔 네트워크 보안 구성도" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ 호텔 네트워크 보안 구성도 (VLAN 분리)
                      </p>
                    </div>

                    {/* 이미지 2 (환경구성도) */}
                    <div className="gallery-item">
                      <img 
                        src="/public/p2-2.jpg" 
                        alt="다계층 심층 방어 아키텍처 환경구성도" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ 다계층 심층 방어 아키텍처 환경구성도
                      </p>
                    </div>

                    {/* 이미지 3 (OS Command Injection 방어) */}
                    <div className="gallery-item">
                      <img 
                        src="/public/p2-3.jpg" 
                        alt="OS Command Injection / WAF 검증 및 방어 로그" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ OS Command Injection / WAF 검증 및 방어 로그
                      </p>
                    </div>

                    {/* 이미지 4 (Slowloris 방어) */}
                    <div className="gallery-item">
                      <img 
                        src="/public/p2-4.jpg" 
                        alt="Slowloris DoS 공격 탐지 및 IPS 차단 검증" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ Slowloris DoS 공격 탐지 및 IPS 차단 검증
                      </p>
                    </div>

                    {/* 이미지 5 (악성 파일 방어) */}
                    <div className="gallery-item">
                      <img 
                        src="/public/p2-5.jpg" 
                        alt="악성 파일 업로드 교차 검증 및 격리 저장" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ 악성 파일 업로드 교차 검증 및 격리 저장
                      </p>
                    </div>

                    {/* 이미지 6 (자동화 스크립트) */}
                    <div className="gallery-item">
                      <img 
                        src="/public/p2-6.jpg" 
                        alt="KISA 기준 보안 점검 자동화 스크립트 실행 결과" 
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      />
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem', color: '#94a3b8' }}>
                        ▲ KISA 기준 보안 점검 자동화 스크립트 실행 결과
                      </p>
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