import { useEffect, useRef, useState } from 'react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: '⌂' },
  { id: 'scanner', label: 'AI Scanner', icon: '◌' },
  { id: 'collections', label: 'My Collections', icon: '▣' },
  { id: 'wallet', label: 'EcoWallet', icon: '◫' },
  { id: 'impact', label: 'My Impact', icon: '▤' },
];

const sampleOptions = [
  { label: 'PET bottles', icon: '◫' },
  { label: 'Aluminium cans', icon: '▣' },
  { label: 'Cartons', icon: '▤' },
  { label: 'Glass bottles', icon: '◌' },
  { label: 'Organic waste', icon: '✿' },
];

const stats = [
  { label: 'Completed collections', value: '1', detail: 'Verified inside demo flow' },
  { label: 'Recovery earnings', value: '₦2,850', detail: 'Illustrative total' },
  { label: 'Reward points', value: '1,240', detail: 'EcoPoints available' },
];

const weekBars = [58, 40, 68, 82, 52, 78, 66];

function Sidebar({ active, setActive }) {
  return (
    <aside className="sidebar">
      <div className="brand-block"><div className="brand-mark"><span>↻</span></div><span>EcoSync</span></div>
      <div className="sidebar-label">Your space</div>
      <nav className="side-nav" aria-label="Sidebar navigation">
        {navItems.map((item) => (
          <button key={item.id} type="button" className={`nav-item ${active === item.id ? 'active' : ''}`} aria-current={active === item.id ? 'page' : undefined} onClick={() => setActive(item.id)}>
            <span className="nav-icon">{item.icon}</span><span>{item.label}</span>{active === item.id && <span className="nav-dot" />}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer"><div className="mini-device" /></div>
      <div className="profile-card"><div className="profile-avatar">A</div><div className="profile-copy"><strong>Ada Johnson</strong><span>Household demo account</span></div><span className="profile-arrow">›</span></div>
    </aside>
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
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: 'environment' } },
      });
      setStream(cameraStream);
    } catch (error) {
      if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
        setCameraError('Camera permission was denied. Allow camera access in your browser settings and try again.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('No camera was found on this device.');
      } else {
        setCameraError('Could not open the camera. Check that it is connected and not being used by another app.');
      }
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  }

  function takePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      setCameraError('The camera is still starting. Please try again in a moment.');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    setCapturedPhoto(canvas.toDataURL('image/jpeg', 0.9));
    stopCamera();
  }

  return (
    <section className="page-view scanner-view">
      <div className="page-header compact-header">
        <div className="eyebrow">AI WASTE ASSISTANT / DEMONSTRATION</div>
        <h1>Let&apos;s identify your waste.</h1>
        <p>Take a photo or choose a sample to see how EcoSync guides recovery.</p>
      </div>
      <div className="scanner-layout">
        <div className="camera-card panel-card">
          <div className="panel-topline">
            <div className="panel-badge"><span className="mini-icon">◉</span>Your material</div>
            <span className="step-indicator">STEP 01 OF 03</span>
          </div>
          <div className={`camera-box ${stream || capturedPhoto ? 'camera-box-live' : ''}`}>
            {stream ? (
              <>
                <div className="camera-live-frame">
                  <video ref={videoRef} className="camera-video" autoPlay muted playsInline aria-label="Live camera preview" />
                  <span className="camera-live-indicator"><span /> Camera on</span>
                </div>
                <p>Place your item in the frame</p>
                <small>Keep the item well lit and in focus</small>
                <div className="camera-controls">
                  <button type="button" className="cta-button dark" onClick={takePhoto}>Take photo</button>
                  <button type="button" className="secondary-button" onClick={stopCamera}>Close camera</button>
                </div>
              </>
            ) : capturedPhoto ? (
              <>
                <div className="camera-live-frame"><img className="camera-video" src={capturedPhoto} alt="Captured photo of the material" /></div>
                <p>Photo captured</p>
                <small>Your photo stays in this browser session.</small>
                <div className="camera-controls"><button type="button" className="cta-button dark" onClick={openCamera}>Retake photo</button></div>
              </>
            ) : (
              <>
                <div className="camera-frame" aria-label="Camera view">
                  <span className="frame-corner top-left" /><span className="frame-corner top-right" />
                  <span className="frame-corner bottom-left" /><span className="frame-corner bottom-right" />
                  <div className="camera-illustration"><span className="camera-icon">◔</span></div>
                </div>
                <p>Place your item in the frame</p>
                <small>Use daylight for a clear photograph</small>
                <div className="camera-controls"><button type="button" className="cta-button dark" onClick={openCamera}>Open camera</button></div>
              </>
            )}
          </div>
          {cameraError && <p className="camera-error" role="alert">{cameraError}</p>}
        </div>
        <div className="sample-card panel-card">
          <div className="sample-header"><span className="step-indicator">TRY A SAMPLE</span></div>
          <h2>What are we recycling?</h2>
          <p>Choose a sample material. You can correct the result at any time.</p>
          <div className="sample-grid">
            {sampleOptions.map((sample) => (
              <button className={`sample-item ${selectedSample === sample.label ? 'selected' : ''}`} key={sample.label} type="button" aria-pressed={selectedSample === sample.label} onClick={() => setSelectedSample(sample.label)}>
                <span className="sample-icon">{sample.icon}</span><span>{sample.label}</span>
                {selectedSample === sample.label && <span className="tick-pill">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CollectionsView({ onScan }) {
  return (
    <section className="page-view collections-view">
      <div className="page-header collection-header">
        <div className="eyebrow">YOUR RECOVERY ACTIVITY</div>
        <div className="header-row"><h1>My collections</h1><button type="button" className="cta-button dark" onClick={onScan}>+ New scan</button></div>
        <p>Keep track of every material moving toward a second life.</p>
      </div>
      <div className="stats-row">
        <article className="mini-stat"><span className="value">1</span><span className="label">Total demo collections</span></article>
        <article className="mini-stat"><span className="value">0</span><span className="label">Awaiting collection</span></article>
        <article className="mini-stat"><span className="value">1</span><span className="label">Collected</span></article>
      </div>
      <div className="panel-card schedule-panel">
        <div className="panel-heading-row"><div className="eyebrow">IN PROGRESS</div><span className="status-badge success">○ active</span></div>
        <h2>Upcoming pickups</h2>
        <div className="empty-state emphasis"><div className="empty-icon">▣</div><h3>No pickups pending</h3><p>Your next recovery starts with a quick scan.</p><button type="button" className="scan-button" onClick={onScan}>Scan a material →</button></div>
      </div>
      <div className="panel-card collection-history">
        <div className="panel-heading-row"><div className="eyebrow">COMPLETED</div></div><h2>Past collections</h2>
        <div className="history-item"><div className="history-icon">◫</div><div className="history-copy"><div className="history-mainline"><span className="pill">PET plastic bottles</span><span className="success-tag">• Collected</span></div><div className="history-meta"><span>EC-1042 • Yesterday</span></div><div className="history-meta detail-meta"><span>2.4 kg</span><span>GreenHub Collector</span><span>Pickup</span></div></div><div className="history-reward">+₦204</div></div>
      </div>
    </section>
  );
}

function WalletView() {
  const [tab, setTab] = useState('rewards');
  return (
    <section className="page-view wallet-view">
      <div className="page-header compact-header wallet-header"><div className="eyebrow">EARN FROM EVERY RECOVERY</div><div className="header-row"><h1>EcoWallet</h1><button type="button" className="secondary-button">✓ Demo balance</button></div><p>Your recycling value, all in one place.</p></div>
      <div className="wallet-summary">
        <div className="wallet-balance card-surface"><div className="wallet-topline"><span className="brand-name">EcoSync</span><span className="wallet-label">WALLET</span></div><div className="wallet-metric"><span>Available demo earnings</span><strong>₦2,850</strong></div><div className="wallet-footer"><span>Value recovered</span><span>DEMO • NOT WITHDRAWABLE</span></div></div>
        <div className="points-balance card-surface soft-green"><div className="wallet-icon">◫</div><div className="points-label">Available EcoPoints</div><div className="points-value">1,240 <small>pts</small></div><p>Turn positive action into everyday essentials.</p></div>
      </div>
      <div className="wallet-tabs"><button className={`tab-button ${tab === 'rewards' ? 'active' : ''}`} type="button" onClick={() => setTab('rewards')}>Rewards marketplace</button><button className={`tab-button ${tab === 'history' ? 'active' : ''}`} type="button" onClick={() => setTab('history')}>Transaction history</button></div>
      {tab === 'rewards' ? <div className="reward-grid">{stats.map((stat) => <article className="wallet-stat card-surface" key={stat.label}><div className="wallet-stat-icon">{stat.label.includes('Completed') ? '◌' : stat.label.includes('Recovery') ? '▣' : '◫'}</div><div className="wallet-stat-copy"><span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.detail}</small></div></article>)}</div> : <div className="panel-card transaction-empty"><h2>Transaction history</h2><p>Your demo wallet activity will appear here after a collection.</p></div>}
    </section>
  );
}

function ImpactView() {
  return (
    <section className="page-view impact-view">
      <div className="page-header impact-header"><div className="eyebrow">YOUR POSITIVE FOOTPRINT</div><div className="header-row"><h1>Small actions. Lasting impact.</h1><button type="button" className="secondary-button">↗ Growing greener</button></div><p>See what your recovery activity adds up to.</p></div>
      <div className="impact-hero card-surface dark-green"><div className="hero-copy"><div className="eyebrow light">MATERIALS RECOVERED</div><div className="impact-number">8.4<span>kg</span></div><p>Illustrative waste diverted into recovery streams across your demo journey.</p><button type="button" className="cta-button light">Keep it going →</button></div><div className="impact-ring-wrap"><div className="impact-ring"><div className="ring-center"><span className="leaf-icon">✿</span><strong>Every kg counts.</strong></div></div></div></div>
      <div className="impact-stats-grid"><article className="impact-stat card-surface"><div className="impact-icon">↻</div><span>Completed collections</span><strong>1</strong><small>Verified inside demo flow</small></article><article className="impact-stat card-surface"><div className="impact-icon">◫</div><span>Recovery earnings</span><strong>₦2,850</strong><small>Illustrative total</small></article><article className="impact-stat card-surface"><div className="impact-icon">◌</div><span>Reward points</span><strong>1,240</strong><small>EcoPoints available</small></article></div>
      <div className="info-row">
        <div className="chart-card card-surface"><div className="chart-header"><span className="eyebrow">RECOVERY RHYTHM</span><button type="button" className="secondary-button small">Illustrative chart</button></div><h2>A greener week</h2><div className="bar-chart" aria-label="Weekly recovery chart">{weekBars.map((bar, index) => <div key={index} className={`bar ${index === 5 ? 'solid' : ''}`} style={{ height: `${bar}%` }}><span>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span></div>)}</div><p>Keep showing up. Small, consistent actions are how recovery habits grow.</p></div>
        <div className="why-matters card-surface"><div className="chart-header"><span className="eyebrow">WHY IT MATTERS</span></div><h2>Recovery creates a ripple.</h2><ul className="matter-list"><li><span className="matter-icon">◌</span><div><strong>Cleaner surroundings</strong><p>Less unmanaged waste in streets and drainage channels.</p></div></li><li><span className="matter-icon">◫</span><div><strong>Local green livelihoods</strong><p>Recovery creates opportunities for collection partners.</p></div></li><li><span className="matter-icon">▣</span><div><strong>Better waste information</strong><p>Transaction data can inform future circular-economy decisions.</p></div></li></ul></div>
      </div>
      <p className="impact-disclaimer">ⓘ &nbsp;Only demonstrated collection weights update automatically. Environmental outcomes beyond those weights are not calculated or verified.</p>
    </section>
  );
}

function WalkthroughModal({ onClose, onBegin }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="walkthrough-title"><div className="walkthrough-modal"><button type="button" className="close-button" onClick={onClose} aria-label="Close walkthrough">×</button><div className="eyebrow">COUCH 2026 • JUDGE WALKTHROUGH</div><h2 id="walkthrough-title">Experience EcoSync in 2 minutes.</h2><p>Follow this path to experience a complete waste-to-value transaction.</p>
      <ol className="walkthrough-steps"><li><span className="step-marker">1.</span><div className="step-icon">◉</div><div><strong>Scan a material</strong><span>Choose PET bottles and view sorting advice.</span></div></li><li><span className="step-marker">2.</span><div className="step-icon">▣</div><div><strong>See the value</strong><span>Estimate payout and discover EcoPoints.</span></div></li><li><span className="step-marker">3.</span><div className="step-icon">▤</div><div><strong>Request a collection</strong><span>Select a sample recovery partner.</span></div></li><li><span className="step-marker">4.</span><div className="step-icon success-check">✓</div><div><strong>Confirm pickup</strong><span>Use the Collector Console to complete it.</span></div></li><li><span className="step-marker">5.</span><div className="step-icon">◫</div><div><strong>Redeem and measure</strong><span>See EcoWallet and impact totals change.</span></div></li></ol>
      <div className="modal-actions"><button type="button" className="cta-button dark large" onClick={onBegin}>Begin walkthrough →</button><button type="button" className="secondary-button wide" onClick={onClose}>↻ Reset sample data</button></div>
    </div></div>
  );
}

export default function Dashboard() {
  const [activeView, setActiveView] = useState('impact');
  const [showWalkthrough, setShowWalkthrough] = useState(true);
  const [walkthroughStep, setWalkthroughStep] = useState(0);

  const pageTitle = navItems.find((item) => item.id === activeView)?.label ?? 'My Impact';
  const goToScanner = () => setActiveView('scanner');
  const beginWalkthrough = () => { setShowWalkthrough(false); setActiveView('scanner'); setWalkthroughStep(1); };
  const renderedView = activeView === 'collections' ? <CollectionsView onScan={goToScanner} /> : activeView === 'wallet' ? <WalletView /> : activeView === 'overview' || activeView === 'scanner' ? <ScannerView /> : <ImpactView />;

  return (
    <div className="app-shell"><Sidebar active={activeView} setActive={setActiveView} /><main className="main-panel"><header className="topbar"><div className="breadcrumb"><span>EcoSync</span><span className="crumb-divider">›</span><span>{pageTitle}</span></div><div className="topbar-actions"><button type="button" className="demo-pill"><span className="demo-dot" />Interactive demo</button><button type="button" className="icon-button" aria-label="About this demo">i</button><div className="top-avatar">A</div></div></header><div className="main-content">{renderedView}</div></main>
      {showWalkthrough && <WalkthroughModal onClose={() => setShowWalkthrough(false)} onBegin={beginWalkthrough} />}
      {walkthroughStep > 0 && <div className="walkthrough-progress" role="status">Walkthrough started · Step {walkthroughStep} of 5<button type="button" onClick={() => setWalkthroughStep(0)}>End</button></div>}
    </div>
  );
}
