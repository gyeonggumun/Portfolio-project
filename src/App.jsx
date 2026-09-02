import { useState, useRef, useEffect } from 'react';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import './App.css';

function App() {
  // 기존 포트폴리오 상태 관리
  const [activeTab, setActiveTab] = useState(null);
  const detailRef = useRef(null);
  const [showAlert, setShowAlert] = useState(true);

  // 패스키 및 비공개 영역 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [privateData, setPrivateData] = useState(null);
  const [passkeys, setPasskeys] = useState([]);

  // 첫 렌더링 시 로그인 상태(토큰 유효성) 체크
  useEffect(() => {
    fetchPrivateData();
  }, []);

  const toggleTab = (index) => {
    if (activeTab === index) {
      setActiveTab(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTab(index);
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  /* --- WebAuthn 패스키 로직 --- */
  const handleRegister = async () => {
    try {
      const res = await fetch('/api/auth/register-generate');
      const options = await res.json();
      
      const attResp = await startRegistration(options);
      const deviceName = prompt("이 기기의 이름을 정해주세요 (예: 데스크탑 크롬)");
      
      const verifyRes = await fetch('/api/auth/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: attResp, deviceName: deviceName || "알 수 없는 기기" })
      });
      
      if (verifyRes.ok) {
        alert('패스키가 기기에 안전하게 등록되었습니다.');
        fetchPasskeys();
      }
    } catch (error) {
      console.error('등록 취소 또는 에러:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/login-generate');
      const options = await res.json();

      const asseResp = await startAuthentication(options);
      
      const verifyRes = await fetch('/api/auth/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asseResp)
      });
      
      if (verifyRes.ok) {
        setIsLoggedIn(true);
        fetchPrivateData();
        fetchPasskeys();
      } else {
        alert('로그인 검증에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    setIsLoggedIn(false);
    setPrivateData(null);
    setPasskeys([]);
    alert('로그아웃 되었습니다.');
  };

  /* --- 비공개 데이터 및 패스키 목록 관리 --- */
  const fetchPrivateData = async () => {
    const res = await fetch('/api/private/data');
    if (res.ok) {
      setPrivateData(await res.json());
      setIsLoggedIn(true);
      fetchPasskeys(); // 로그인 성공 시 패스키 목록도 함께 갱신
    } else {
      setIsLoggedIn(false);
    }
  };

  const fetchPasskeys = async () => {
    const res = await fetch('/api/private/passkeys');
    if (res.ok) {
      setPasskeys(await res.json());
    }
  };

  const handleDeletePasskey = async (credentialID) => {
    if (!confirm('이 패스키를 지우시겠습니까?')) return;
    
    await fetch('/api/private/passkeys', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credentialID })
    });
    fetchPasskeys();
  };

  return (
    <>
      {showAlert && (
        <div className="custom-alert-overlay" onClick={() => setShowAlert(false)}>
          <div className="custom-alert-box" onClick={(e) => e.stopPropagation()}>
            <p>이 페이지는 <strong>SKT</strong>에게 <strong>k-뉴딜 부산 A반 문경구</strong>의 포트폴리오 페이지를 보여주기 위한 것이다.</p>
            <button onClick={() => setShowAlert(false)}>확인</button>
          </div>
        </div>
      )}

      <div className="portfolio-container">
        {/* =========================================
            공개 영역 (기존 포트폴리오 화면)
        ========================================= */}
        <div className="first-screen">
          <div className="content-wrapper">
            <header className="header-section">
              <div className="profile-card">
                <h3>👨‍💻 기본 정보 및 주요 프로젝트</h3>
                <ul className="info-list">
                  <li><strong>이름</strong> 문경구</li>
                  <li><strong>이메일</strong> lion989072@gmail.com</li>
                  <li className="project-list">
                    <strong>주요 프로젝트</strong> 
                    <p>- 엔터프라이즈 인프라 및 보안 네트워크 구축 (pfSense, Graylog)</p>
                    <p>- DB Master-Slave 서버 연동 및 모니터링 구축</p>
                  </li>
                  <li><strong>GitHub</strong> <a href="https://github.com/gyeonggumun" target="_blank" rel="noreferrer">저장소 바로가기 ↗</a></li>
                </ul>
              </div>
            </header>

            <main className="strengths-section">
              <h2>💡 핵심 역량 (클릭하여 상세 보기)</h2>
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
            </main>
          </div>
        </div>

        {/* 기존 상세 내용 렌더링 생략 방지 (코드 양 조절을 위해 일부만 유지) */}
        {activeTab !== null && (
          <div className="full-detail-section" ref={detailRef}>
            <div className="detail-content-box">
              <h2>상세 프로젝트 설명</h2>
              <p>여기에 선택한 탭의 내용이 보입니다.</p>
              <button className="close-btn" onClick={() => {
                setActiveTab(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}>접기 및 위로 가기 ⬆</button>
            </div>
          </div>
        )}

        {/* =========================================
            비공개 영역 (체크리스트 분리 요구사항)
        ========================================= */}
        <div style={{ backgroundColor: '#f1f8ff', padding: '4rem 2rem', borderTop: '2px dashed #adb5bd' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#1864ab' }}>🔒 나만 보는 자리 (비공개 공간)</h2>
            <p style={{ marginBottom: '2rem', color: '#495057' }}>
              이 아래는 비밀번호 없이 기기 고유의 <strong>패스키(WebAuthn)</strong>로만 열리는 공간입니다.
            </p>

            {!isLoggedIn ? (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={handleRegister} 
                  style={{ padding: '0.8rem 1.5rem', cursor: 'pointer', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '8px' }}>
                  🔑 새 패스키(기기) 등록
                </button>
                <button 
                  onClick={handleLogin} 
                  style={{ padding: '0.8rem 1.5rem', cursor: 'pointer', backgroundColor: '#228be6', color: '#fff', border: 'none', borderRadius: '8px' }}>
                  🔓 패스키로 로그인
                </button>
              </div>
            ) : (
              <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e9ecef', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0 }}>나만의 데이터</h3>
                  <button onClick={handleLogout} style={{ padding: '0.4rem 1rem', cursor: 'pointer', borderRadius: '6px' }}>로그아웃</button>
                </div>
                
                {/* T08-C14: 비공개 영역 세 개 이상의 항목 */}
                <ul style={{ lineHeight: '1.8', marginBottom: '3rem' }}>
                  {privateData?.map(item => (
                    <li key={item.id} style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: '#228be6' }}>{item.title}</strong><br />
                      {item.content}
                    </li>
                  ))}
                </ul>

                {/* T08-C43: 다중 패스키 관리 기능 */}
                <h3 style={{ borderBottom: '1px solid #e9ecef', paddingBottom: '0.5rem', marginBottom: '1rem' }}>내 패스키 관리 (기기 목록)</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {passkeys.map(pk => (
                    <li key={pk.credentialID} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: '#f8f9fa', marginBottom: '0.5rem', borderRadius: '6px' }}>
                      <span><strong>{pk.name}</strong> <small style={{ color: '#868e96' }}>(등록일: {new Date(pk.createdAt).toLocaleDateString()})</small></span>
                      <button onClick={() => handleDeletePasskey(pk.credentialID)} style={{ background: '#fa5252', color: 'white', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>
                        삭제
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

export default App;