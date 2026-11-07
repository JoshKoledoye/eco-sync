import { useEffect, useRef, useState } from 'react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: '🏠' },
  { id: 'scanner', label: 'AI Scanner', icon: '⛶' },
  { id: 'collections', label: 'My Collections', icon: '🛍️' },
  { id: 'wallet', label: 'EcoWallet', icon: '💵' },
  { id: 'impact', label: 'My Impact', icon: '🌱' },
];

const sampleOptions = [
  { label: 'PET bottles', icon: '🥤' },
  { label: 'Aluminium cans', icon: '🥫' },
  { label: 'Cartons', icon: '📦' },
  { label: 'Glass waste', icon: '🥛' },
  { label: 'Organic waste', icon: '☢️' },
];

const stats = [
  { label: 'Completed collections', value: '1', detail: 'Verified inside demo flow' },
  { label: 'Recovery earnings', value: '₦2,850', detail: 'Illustrative total' },
  { label: 'Reward points', value: '1,240', detail: 'EcoPoints available' },
];
const weekBars = [58, 40, 68, 82, 52, 78, 66];

function Sidebar({ active, setActive, collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="brand-block"><div className="brand-mark"><span>↻</span></div><span className="sidebar-wordmark">EcoSync</span></div>
      <button type="button" className="sidebar-collapse-button" onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}><span aria-hidden="true">{collapsed ? '»' : '«'}</span><span className="sidebar-toggle-label">{collapsed ? 'Expand' : 'Collapse'}</span></button>
      <div className="sidebar-label">Your space</div>
      <nav className="side-nav" aria-label="Sidebar navigation">
        {navItems.map((item) => (
          <button key={item.id} type="button" title={collapsed ? item.label : undefined} className={`nav-item ${active === item.id ? 'active' : ''}`} aria-current={active === item.id ? 'page' : undefined} onClick={() => setActive(item.id)}>
            <span className="nav-icon">{item.icon}</span><span className="nav-label">{item.label}</span>{active === item.id && <span className="nav-dot" />}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer"><div className="mini-device" /></div>
      <div className="profile-card"><div className="profile-avatar">A</div><div className="profile-copy"><strong>Ogunmepon Okechukwu</strong><span>Household demo account</span></div><span className="profile-tag">Live</span></div>
    </aside>
  );
}

function OverviewView({ onScan, onNavigate }) {
  return (
    <section className="page-view overview-view">
      <div className="page-header compact-header"><div className="eyebrow">HOME / DASHBOARD</div><h1>Good to see you, Ogunmepon</h1><p>Here&apos;s a quick snapshot of your recovery progress and activity.</p></div>
      <div className="stats-row">
        <article className="mini-stat"><span className="value">1</span><span className="label">Collections logged</span></article>
        <article className="mini-stat"><span className="value">₦2,850</span><span className="label">Recovery earnings</span></article>
        <article className="mini-stat"><span className="value">1,240</span><span className="label">EcoPoints</span></article>
      </div>
      <div className="panel-card overview-actions"><div className="panel-heading-row"><div className="eyebrow">YOUR ROUTINE</div></div><h2>Everything you need at a glance</h2><p>Scan a new material, review your collections, and track the impact you are creating.</p><div className="overview-action-buttons"><button type="button" className="cta-button dark" onClick={onScan}>Start a new scan →</button><button type="button" className="secondary-button" onClick={() => onNavigate('collections')}>View collections</button><button type="button" className="secondary-button" onClick={() => onNavigate('impact')}>Explore my impact</button></div></div>
    </section>
  );
}

function ScannerView() {
  const [selectedSample, setSelectedSample] = useState('PET bottles');
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState('');
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [stream]);

  async function openCamera() {
    setCameraError('');
    setCapturedPhoto('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is not available in this browser. Try a recent browser over HTTPS.');
      return;
    }
    try {
      setStream(await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' } } }));
    } catch (error) {
      if (error.name === 'NotAllowedError' || error.name === 'SecurityError') setCameraError('Camera permission was denied. Allow camera access in your browser settings and try again.');
      else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') setCameraError('No camera was found on this device.');
      else setCameraError('Could not open the camera. Check that it is connected and not being used by another app.');
    }
  }
  function stopCamera() { stream?.getTracks().forEach((track) => track.stop()); setStream(null); }
  function takePhoto() {
    const video = videoRef.current;
    if (!video?.videoWidth) { setCameraError('The camera is still starting. Please try again in a moment.'); return; }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    setCapturedPhoto(canvas.toDataURL('image/jpeg', 0.9)); stopCamera();
  }

  return (
    <section className="page-view scanner-view">
      <div className="page-header compact-header"><div className="eyebrow">AI WASTE ASSISTANT / DEMONSTRATION</div><h1>Let&apos;s identify your waste.</h1><p>Take a photo or choose a sample to see how EcoSync guides recovery.</p></div>
      <div className="scanner-layout">
        <div className="camera-card panel-card"><div className="panel-topline"><div className="panel-badge"><span className="mini-icon">◉</span>Your material</div><span className="step-indicator">STEP 01 OF 03</span></div>
          <div className={`camera-box ${stream || capturedPhoto ? 'camera-box-live' : ''}`}>
            {stream ? <><div className="camera-live-frame"><video ref={videoRef} className="camera-video" autoPlay muted playsInline aria-label="Live camera preview" /><span className="camera-live-indicator"><span /> Camera on</span></div><p>Take a photo to scan now</p><small>Keep items well lit and in focus</small><div className="camera-controls"><button type="button" className="cta-button dark" onClick={takePhoto}>Take photo</button><button type="button" className="secondary-button" onClick={stopCamera}>Close camera</button></div></>
              : capturedPhoto ? <><div className="camera-live-frame"><img className="camera-video" src={capturedPhoto} alt="Captured photo of the material" /></div><p>Photo captured</p><small>Your photo stays in this browser session.</small><div className="camera-controls"><button type="button" className="cta-button dark" onClick={openCamera}>Retake photo</button></div></>
                : <><div className="camera-frame" aria-label="Camera view"><span className="frame-corner top-left" /><span className="frame-corner top-right" /><span className="frame-corner bottom-left" /><span className="frame-corner bottom-right" /><div className="camera-illustration"><span className="camera-icon">⛶</span></div></div><p>Take a photo to begin scanning</p><small>Keep your items well lit</small><div className="camera-controls"><button type="button" className="cta-button dark" onClick={openCamera}>Open camera</button></div></>}
          </div>{cameraError && <p className="camera-error" role="alert">{cameraError}</p>}
        </div>
        <div className="sample-card panel-card"><div className="sample-header"><span className="step-indicator">TRY A SAMPLE</span></div><h2>What are we recycling?</h2><p>Choose a sample material. You can correct the result at any time.</p><div className="sample-grid">{sampleOptions.map((sample) => <button className={`sample-item ${selectedSample === sample.label ? 'selected' : ''}`} key={sample.label} type="button" aria-pressed={selectedSample === sample.label} onClick={() => setSelectedSample(sample.label)}><span className="sample-icon">{sample.icon}</span><span>{sample.label}</span>{selectedSample === sample.label && <span className="tick-pill">✓</span>}</button>)}</div><p className="sample-selection" role="status">Selected: <strong>{selectedSample}</strong></p></div>
      </div>
    </section>
  );
}

function CollectionsView({ onScan }) {
  return (
    <section className="page-view collections-view"><div className="page-header collection-header"><div className="eyebrow">YOUR RECOVERY ACTIVITY</div><div className="header-row"><h1>My collections</h1><button type="button" className="cta-button dark" onClick={onScan}>+ New scan</button></div><p>Keep track of every material moving toward a second life.</p></div>
      <div className="stats-row"><article className="mini-stat"><span className="value">1</span><span className="label">Total demo collections</span></article><article className="mini-stat"><span className="value">0</span><span className="label">Awaiting collection</span></article><article className="mini-stat"><span className="value">1</span><span className="label">Collected</span></article></div>
      <div className="panel-card schedule-panel"><div className="panel-heading-row"><div className="eyebrow">IN PROGRESS</div><span className="status-badge success">○ active</span></div><h2>Upcoming pickups</h2><div className="empty-state emphasis"><div className="empty-icon">▣</div><h3>No pickups pending</h3><p>Your next recovery starts with a quick scan.</p><button type="button" className="scan-button secondary-button" onClick={onScan}>Schedule a collection</button></div></div>
      <div className="panel-card collection-history"><div className="panel-heading-row"><div className="eyebrow">COMPLETED</div></div><h2>Past collections</h2><div className="history-item"><div className="history-icon">◫</div><div className="history-copy"><div className="history-mainline"><span className="pill">PET plastic bottles</span><span className="history-date">Mar 12</span></div><p>Recovered for a local circular hub</p></div></div></div>
    </section>
  );
}

function WalletView() {
  const [tab, setTab] = useState('rewards');
  return (
    <section className="page-view wallet-view"><div className="page-header compact-header wallet-header"><div className="eyebrow">EARN FROM EVERY RECOVERY</div><div className="header-row"><h1>EcoWallet</h1><button type="button" className="secondary-button small" onClick={() => setTab('activity')}>View activity</button></div></div>
      <div className="wallet-summary"><div className="wallet-balance card-surface"><div className="wallet-topline"><span className="brand-name">EcoSync</span><span className="wallet-label">WALLET</span></div><div className="wallet-total">₦41,200</div><small>Available balance</small></div><div className="points-balance card-surface soft-green"><div className="wallet-icon">◫</div><div className="points-label">Available EcoPoints</div><div className="points-value">1,240 <small>points</small></div></div></div>
      <div className="wallet-tabs"><button className={`tab-button ${tab === 'rewards' ? 'active' : ''}`} type="button" aria-pressed={tab === 'rewards'} onClick={() => setTab('rewards')}>Rewards marketplace</button><button className={`tab-button ${tab === 'activity' ? 'active' : ''}`} type="button" aria-pressed={tab === 'activity'} onClick={() => setTab('activity')}>Wallet activity</button></div>
      {tab === 'rewards' ? <div className="reward-grid">{stats.map((stat) => <article className="wallet-stat card-surface" key={stat.label}><div className="wallet-stat-icon">{stat.label.includes('Completed') ? '✓' : stat.label.includes('Recovery') ? '₦' : '◌'}</div><div><strong>{stat.value}</strong><span>{stat.label}</span><small>{stat.detail}</small></div></article>)}</div> : <div className="panel-card"><h2>Recent wallet activity</h2><p>No payouts or deductions in the last 7 days.</p><button type="button" className="secondary-button" onClick={() => setTab('rewards')}>Back to rewards</button></div>}
    </section>
  );
}

function ImpactView() {
  return (
    <section className="page-view impact-view"><div className="page-header impact-header"><div className="eyebrow">YOUR POSITIVE FOOTPRINT</div><div className="header-row"><h1>Small actions. Lasting impact.</h1><span className="secondary-button small">Your impact summary</span></div></div>
      <div className="impact-hero card-surface dark-green"><div className="hero-copy"><div className="eyebrow light">MATERIALS RECOVERED</div><div className="impact-number">8.4<span>kg</span></div><p>Recovered through your demo and verified collection loops.</p></div></div>
      <div className="impact-stats-grid"><article className="impact-stat card-surface"><div className="impact-icon">↻</div><span>Completed collections</span><strong>1</strong><small>Verified inside demo flow</small></article><article className="impact-stat card-surface"><div className="impact-icon">▣</div><span>Recovery earnings</span><strong>₦2,850</strong><small>Illustrative total</small></article><article className="impact-stat card-surface"><div className="impact-icon">◫</div><span>Reward points</span><strong>1,240</strong><small>EcoPoints available</small></article></div>
      <div className="info-row"><div className="chart-card card-surface"><div className="chart-header"><span className="eyebrow">RECOVERY RHYTHM</span><span className="secondary-button small">Illustrative chart</span></div><div className="bar-chart" aria-label="Weekly recovery rhythm">{weekBars.map((value, index) => <span key={index} title={`Day ${index + 1}: ${value}%`} style={{ height: `${value}%` }} />)}</div></div><div className="why-matters card-surface"><div className="chart-header"><span className="eyebrow">WHY IT MATTERS</span></div><h2>Recovery creates a ripple.</h2><ul className="matter-list"><li>Material is kept in circulation instead of landfill.</li><li>Collection routines build cleaner neighbourhoods.</li><li>Every action compounds into a larger sustainability loop.</li></ul></div></div>
      <p className="impact-disclaimer">ⓘ &nbsp;Only demonstrated collection weights update automatically. Environmental outcomes beyond those weights are not calculated or verified.</p>
    </section>
  );
}

function WalkthroughModal({ onClose, onBegin }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="walkthrough-title"><div className="walkthrough-modal"><button type="button" className="close-button" onClick={onClose} aria-label="Close walkthrough">×</button><div className="walkthrough-header"><div className="eyebrow">WELCOME</div><h2 id="walkthrough-title">EcoSync quick start</h2></div><ol className="walkthrough-steps"><li><span className="step-marker">1.</span><div className="step-icon">◉</div><div><strong>Scan a material</strong><span>Choose PET bottles and view sorting advice.</span></div></li><li><span className="step-marker">2.</span><div className="step-icon">▣</div><div><strong>Track collections</strong><span>Review status, pickup timing, and your activity log.</span></div></li><li><span className="step-marker">3.</span><div className="step-icon">◫</div><div><strong>Earn rewards</strong><span>Turn recovery into EcoPoints and wallet balance.</span></div></li></ol><div className="modal-actions"><button type="button" className="cta-button dark large" onClick={onBegin}>Begin walkthrough →</button><button type="button" className="secondary-button wide" onClick={onClose}>Skip</button></div></div></div>;
}

export default function Dashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [showWalkthrough, setShowWalkthrough] = useState(true);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const pageTitle = navItems.find((item) => item.id === activeView)?.label ?? 'Overview';
  const goToScanner = () => setActiveView('scanner');
  const beginWalkthrough = () => { setShowWalkthrough(false); setActiveView('scanner'); setWalkthroughStep(1); };
  const renderedView = activeView === 'overview' ? <OverviewView onScan={goToScanner} onNavigate={setActiveView} /> : activeView === 'collections' ? <CollectionsView onScan={goToScanner} /> : activeView === 'wallet' ? <WalletView /> : activeView === 'scanner' ? <ScannerView /> : <ImpactView />;

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      <style>{`
        .sidebar, .main-panel, .nav-item, .nav-item .nav-label, .sidebar-wordmark, .profile-copy, .profile-tag, .sidebar-collapse-button, .page-view, .panel-card, .mini-stat, .card-surface, .cta-button, .secondary-button, .sample-item { transition: all 240ms cubic-bezier(.2,.75,.25,1); }
        .sidebar-collapse-button { display:flex; align-items:center; justify-content:center; gap:9px; width:calc(100% - 32px); margin:12px 16px 18px; padding:9px 10px; border:1px solid rgba(255,255,255,.13); border-radius:10px; color:inherit; background:rgba(255,255,255,.06); cursor:pointer; }
        .sidebar-collapse-button:hover { background:rgba(255,255,255,.14); transform:translateY(-1px); }
        .overview-action-buttons { display:flex; flex-wrap:wrap; gap:10px; margin-top:20px; }
        .page-view { animation: dashboard-enter 420ms cubic-bezier(.2,.7,.25,1) both; }
        .page-view .page-header, .page-view .stats-row, .page-view > .panel-card, .page-view .scanner-layout, .page-view .wallet-summary, .page-view .impact-hero, .page-view .impact-stats-grid, .page-view .info-row { animation: dashboard-rise 480ms cubic-bezier(.2,.7,.25,1) both; }
        .page-view .stats-row, .page-view .wallet-summary, .page-view .impact-stats-grid { animation-delay:70ms; }
        .page-view > .panel-card:nth-of-type(2), .page-view .info-row { animation-delay:130ms; }
        .panel-card:hover, .mini-stat:hover, .card-surface:hover { transform:translateY(-3px); box-shadow:0 12px 28px rgba(20,45,33,.09); }
        .nav-item:hover, .sample-item:hover, .cta-button:hover, .secondary-button:hover { transform:translateY(-2px); }
        .sample-item:active, .cta-button:active, .secondary-button:active { transform:scale(.98); }
        .sidebar-is-collapsed .sidebar-wordmark, .sidebar-is-collapsed .sidebar-label, .sidebar-is-collapsed .sidebar-toggle-label, .sidebar-is-collapsed .nav-label, .sidebar-is-collapsed .profile-copy, .sidebar-is-collapsed .profile-tag { opacity:0; width:0; overflow:hidden; pointer-events:none; white-space:nowrap; }
        .sidebar-is-collapsed .sidebar-collapse-button { width:48px; margin-left:auto; margin-right:auto; }
        .sidebar-is-collapsed .nav-item { justify-content:center; padding-left:8px; padding-right:8px; }
        .sidebar-is-collapsed .profile-card { justify-content:center; padding-left:6px; padding-right:6px; }
        @keyframes dashboard-enter { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes dashboard-rise { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @media (min-width: 900px) { .sidebar-is-collapsed .sidebar { width:88px; min-width:88px; } .sidebar-is-collapsed .main-panel { min-width:0; } }
        @media (max-width: 899px) { .sidebar-collapse-button { display:none; } .sidebar-is-collapsed .sidebar-wordmark, .sidebar-is-collapsed .sidebar-label, .sidebar-is-collapsed .nav-label, .sidebar-is-collapsed .profile-copy, .sidebar-is-collapsed .profile-tag { opacity:initial; width:auto; overflow:visible; pointer-events:auto; } .sidebar-is-collapsed .nav-item { justify-content:initial; } .sidebar-is-collapsed .profile-card { justify-content:initial; } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration:.01ms !important; animation-iteration-count:1 !important; scroll-behavior:auto !important; transition-duration:.01ms !important; } }
      `}</style>
      <Sidebar active={activeView} setActive={setActiveView} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((value) => !value)} />
      <main className="main-panel"><header className="topbar"><div className="breadcrumb"><span>EcoSync</span><span className="crumb-divider">/</span><span>{pageTitle}</span></div><div className="topbar-actions"><button type="button" className="secondary-button small" onClick={() => setShowWalkthrough(true)}>Quick guide</button></div></header>
        <div key={activeView}>{renderedView}</div>
        {showWalkthrough && <WalkthroughModal onClose={() => setShowWalkthrough(false)} onBegin={beginWalkthrough} />}
        {walkthroughStep > 0 && <div className="walkthrough-progress" role="status">Walkthrough started · Step {walkthroughStep} of 5<button type="button" onClick={() => setWalkthroughStep(0)}>End</button></div>}
      </main>
    </div>
  );
}
