import { useEffect, useRef, useState } from 'react';
import logo from './logo.jpg';
import EcoBotChat from './EcoBotChat';

const navItems = [
  { id: 'overview', label: 'Overview', shortLabel: 'Home', icon: '🏠' },
  { id: 'scanner', label: 'AI Scanner', shortLabel: 'Scan', icon: '⛶' },
  { id: 'collections', label: 'My Collections', shortLabel: 'Pickups', icon: '🛍️' },
  { id: 'wallet', label: 'EcoWallet', shortLabel: 'Wallet', icon: '💵' },
  { id: 'impact', label: 'My Impact', shortLabel: 'Impact', icon: '🌱' },
];

const sampleOptions = [
  { label: 'PET bottles', icon: '🥤', rate: '₦150/kg', points: '+120 pts', advice: 'Rinse, crush flat, and keep caps separate for high-grade polymer recovery.' },
  { label: 'Aluminium cans', icon: '🥫', rate: '₦450/kg', points: '+210 pts', advice: 'Empty liquids completely. Do not mix with steel or tin cans.' },
  { label: 'Cartons', icon: '📦', rate: '₦90/kg', points: '+80 pts', advice: 'Flatten dry corrugated cardboard and remove heavy plastic packing tape.' },
  { label: 'Glass waste', icon: '🥛', rate: '₦110/kg', points: '+95 pts', advice: 'Separate clear and colored glass. Keep intact to avoid contamination.' },
  { label: 'Organic waste', icon: '☢️', rate: '₦40/kg', points: '+50 pts', advice: 'Suitable for municipal biogas & composting hubs. Keep free of plastics.' },
];

const stats = [
  { label: 'Completed collections', value: '1', detail: 'Verified inside demo flow' },
  { label: 'Recovery earnings', value: '₦2,850', detail: 'Illustrative total' },
  { label: 'Reward points', value: '1,240', detail: 'EcoPoints available' },
];
const weekBars = [58, 40, 68, 82, 52, 78, 66];

function Sidebar({ active, setActive, collapsed, onToggle, onOpenChat }) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <button
        type="button"
        className="sidebar-collapse-button"
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '→' : '←'}
      </button>

      <div className="sidebar-label">Your space</div>

      <nav className="side-nav" aria-label="Sidebar navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            title={collapsed ? item.label : undefined}
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            aria-current={active === item.id ? 'page' : undefined}
            onClick={() => setActive(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {active === item.id && <span className="nav-dot" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="nav-item chatbot-trigger-btn" onClick={onOpenChat}>
          <span className="nav-icon">🤖</span>
          <span className="nav-label">Ask EcoBot AI</span>
        </button>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">A</div>
        <div className="profile-copy">
          <strong>Ogunmepon Okechukwu</strong>
          <span>Household demo account</span>
        </div>
        <span className="profile-tag">Demo</span>
      </div>
    </aside>
  );
}

function OverviewView({ onScan, onNavigate }) {
  return (
    <section className="page-view overview-view">
      <img src={logo} alt="EcoSync logo" className="dashboard-logo" style={{ height: '80px', width: 'auto', display: 'block' }} />
      <div className="page-header compact-header">
        <div className="eyebrow">HOME / DASHBOARD</div>
        <h1>Good to see you, Ogunmepon</h1>
        <p>Here&apos;s a quick snapshot of your recovery progress and activity.</p>
      </div>
      <div className="stats-row">
        <article className="mini-stat"><span className="value">1</span><span className="label">Collections logged</span></article>
        <article className="mini-stat"><span className="value">₦2,850</span><span className="label">Recovery earnings</span></article>
        <article className="mini-stat"><span className="value">1,240</span><span className="label">EcoPoints</span></article>
      </div>
      <div className="panel-card overview-actions">
        <div className="panel-heading-row"><div className="eyebrow">YOUR ROUTINE</div></div>
        <h2>Everything you need at a glance</h2>
        <p>Scan a new material, review your collections, and track the impact you are creating.</p>
        <div className="overview-action-buttons">
          <button type="button" className="cta-button dark" onClick={onScan}>Start a new scan →</button>
          <button type="button" className="secondary-button" onClick={() => onNavigate('collections')}>View collections</button>
          <button type="button" className="secondary-button" onClick={() => onNavigate('impact')}>Explore my impact</button>
        </div>
      </div>
    </section>
  );
}

function ScannerView() {
  const [selectedSample, setSelectedSample] = useState('PET bottles');
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentSampleObj = sampleOptions.find((s) => s.label === selectedSample) || sampleOptions[0];

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [stream]);

  function runAiAnalysis(materialLabel) {
    setIsAnalyzing(true);
    setScanResult(null);
    setTimeout(() => {
      const match = sampleOptions.find((s) => s.label === materialLabel) || sampleOptions[0];
      setIsAnalyzing(false);
      setScanResult({
        material: match.label,
        confidence: (94.5 + Math.random() * 4.2).toFixed(1),
        rate: match.rate,
        points: match.points,
        advice: match.advice,
      });
    }, 900);
  }

  async function openCamera() {
    setCameraError('');
    setCapturedPhoto('');
    setScanResult(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is not available in this browser. Try uploading an image file instead.');
      return;
    }
    try {
      setStream(await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' } } }));
    } catch (error) {
      if (error.name === 'NotAllowedError' || error.name === 'SecurityError') setCameraError('Camera permission was denied. Allow camera access or upload an image.');
      else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') setCameraError('No camera was found on this device. Use upload instead.');
      else setCameraError('Could not open the camera. Check your device settings or upload an image.');
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  }

  function takePhoto() {
    const video = videoRef.current;
    if (!video?.videoWidth) { setCameraError('The camera is still starting. Please try again in a moment.'); return; }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(photoUrl);
    stopCamera();
    runAiAnalysis(selectedSample);
  }

  function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setCameraError('Please select a valid image file.');
      return;
    }
    setCameraError('');
    stopCamera();
    const reader = new FileReader();
    reader.onload = () => {
      setCapturedPhoto(reader.result);
      runAiAnalysis(selectedSample);
    };
    reader.onerror = () => {
      setCameraError('Failed to read the uploaded file.');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  return (
    <section className="page-view scanner-view">
      <div className="page-header compact-header">
        <div className="eyebrow">AI VISION ENGINE / CLASSIFICATION</div>
        <h1>Let&apos;s identify your waste.</h1>
        <p>Take a photo, upload an image, or choose a sample to run automated AI material telemetry.</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        aria-label="Upload waste photo"
      />

      <div className="scanner-layout">
        <div className="camera-card panel-card">
          <div className="panel-topline">
            <div className="panel-badge"><span className="mini-icon">◉</span>Optical Sensor &amp; Upload</div>
            <span className="step-indicator">STEP 01 OF 03</span>
          </div>
          <div className={`camera-box ${stream || capturedPhoto ? 'camera-box-live' : ''}`}>
            {stream ? (
              <>
                <div className="camera-live-frame">
                  <video ref={videoRef} className="camera-video" autoPlay muted playsInline aria-label="Live camera preview" />
                  <span className="camera-live-indicator"><span /> LIVE FEED</span>
                </div>
                <p>Align waste item inside the frame</p>
                <small>Ensure clear lighting for optimal material detection</small>
                <div className="camera-controls">
                  <button type="button" className="cta-button dark" onClick={takePhoto}>Take photo</button>
                  <button type="button" className="secondary-button" onClick={() => fileInputRef.current?.click()}>Upload photo</button>
                  <button type="button" className="secondary-button" onClick={stopCamera}>Close camera</button>
                </div>
              </>
            ) : capturedPhoto ? (
              <>
                <div className="camera-live-frame">
                  <img className="camera-video" src={capturedPhoto} alt="Captured or uploaded photo of the material" />
                  {isAnalyzing && <div className="scan-laser" />}
                </div>
                <p>{isAnalyzing ? 'AI analyzing material composition...' : 'Image verified for recovery'}</p>
                <small>Processed instantly via Vision API</small>
                <div className="camera-controls">
                  <button type="button" className="cta-button dark" onClick={openCamera}>Retake photo</button>
                  <button type="button" className="secondary-button" onClick={() => fileInputRef.current?.click()}>Upload new</button>
                  <button type="button" className="secondary-button" onClick={() => { setCapturedPhoto(''); setScanResult(null); }}>Reset</button>
                </div>
              </>
            ) : (
              <>
                <div className="camera-frame" aria-label="Camera view">
                  <span className="frame-corner top-left" />
                  <span className="frame-corner top-right" />
                  <span className="frame-corner bottom-left" />
                  <span className="frame-corner bottom-right" />
                  <div className="camera-illustration"><span className="camera-icon">⛶</span></div>
                </div>
                <p>Take a photo or upload to begin scanning</p>
                <small>Keep your items well lit</small>
                <div className="camera-controls">
                  <button type="button" className="cta-button dark" onClick={openCamera}>Open camera</button>
                  <button type="button" className="secondary-button" onClick={() => fileInputRef.current?.click()}>Upload photo</button>
                </div>
              </>
            )}
          </div>
          {cameraError && <p className="camera-error" role="alert">{cameraError}</p>}
        </div>

        <div className="sample-card panel-card">
          <div className="sample-header">
            <span className="step-indicator">CLASSIFICATION TARGET</span>
            <span className="badge-pill">{currentSampleObj.rate}</span>
          </div>
          <h2>Select or override material</h2>
          <p>Choose a material class below to calibrate the scanner or run a diagnostic.</p>
          <div className="sample-grid">
            {sampleOptions.map((sample) => (
              <button 
                className={`sample-item ${selectedSample === sample.label ? 'selected' : ''}`} 
                key={sample.label} 
                type="button" 
                aria-pressed={selectedSample === sample.label} 
                onClick={() => {
                  setSelectedSample(sample.label);
                  if (capturedPhoto) runAiAnalysis(sample.label);
                }}
              >
                <span className="sample-icon">{sample.icon}</span>
                <span>{sample.label}</span>
                {selectedSample === sample.label && <span className="tick-pill">✓</span>}
              </button>
            ))}
          </div>

          <div className="ai-result-box">
            <div className="ai-result-header">
              <span className="eyebrow">AI TELEMETRY OUTPUT</span>
              <span className="confidence-badge">
                {isAnalyzing ? 'ANALYZING...' : scanResult ? `${scanResult.confidence}% MATCH` : 'READY'}
              </span>
            </div>
            <div className="ai-result-metrics">
              <div>
                <small>Detected Class</small>
                <strong>{scanResult ? scanResult.material : selectedSample}</strong>
              </div>
              <div>
                <small>Est. Yield</small>
                <strong className="emerald-text">{scanResult ? scanResult.points : currentSampleObj.points}</strong>
              </div>
            </div>
            <p className="ai-advice">
              {scanResult ? scanResult.advice : currentSampleObj.advice}
            </p>
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
        <div className="empty-state emphasis">
          <div className="empty-icon">▣</div>
          <h3>No pickups pending</h3>
          <p>Your next recovery starts with a quick scan.</p>
          <button type="button" className="scan-button secondary-button" onClick={onScan}>Schedule a collection</button>
        </div>
      </div>
      <div className="panel-card collection-history">
        <div className="panel-heading-row"><div className="eyebrow">COMPLETED</div></div>
        <h2>Past collections</h2>
        <div className="history-item">
          <div className="history-icon">◫</div>
          <div className="history-copy">
            <div className="history-mainline"><span className="pill">PET plastic bottles</span><span className="history-date">Mar 12</span></div>
            <p>Recovered for a local circular hub</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WalletView() {
  const [tab, setTab] = useState('rewards');
  return (
    <section className="page-view wallet-view">
      <div className="page-header compact-header wallet-header">
        <div className="eyebrow">EARN FROM EVERY RECOVERY</div>
        <div className="header-row"><h1>EcoWallet</h1><button type="button" className="secondary-button small" onClick={() => setTab('activity')}>View activity</button></div>
      </div>
      <div className="wallet-summary">
        <div className="wallet-balance card-surface">
          <div className="wallet-topline"><span className="brand-name">EcoSync</span><span className="wallet-label">WALLET</span></div>
          <div className="wallet-total">₦41,200</div>
          <small>Available balance</small>
        </div>
        <div className="points-balance card-surface soft-green">
          <div className="wallet-icon">◫</div>
          <div className="points-label">Available EcoPoints</div>
          <div className="points-value">1,240 <small>points</small></div>
        </div>
      </div>
      <div className="wallet-tabs">
        <button className={`tab-button ${tab === 'rewards' ? 'active' : ''}`} type="button" aria-pressed={tab === 'rewards'} onClick={() => setTab('rewards')}>Rewards marketplace</button>
        <button className={`tab-button ${tab === 'activity' ? 'active' : ''}`} type="button" aria-pressed={tab === 'activity'} onClick={() => setTab('activity')}>Wallet activity</button>
      </div>
      {tab === 'rewards' ? (
        <div className="reward-grid">
          {stats.map((stat) => (
            <article className="wallet-stat card-surface" key={stat.label}>
              <div className="wallet-stat-icon">{stat.label.includes('Completed') ? '✓' : stat.label.includes('Recovery') ? '₦' : '◌'}</div>
              <div><strong>{stat.value}</strong><span>{stat.label}</span><small>{stat.detail}</small></div>
            </article>
          ))}
        </div>
      ) : (
        <div className="panel-card">
          <h2>Recent wallet activity</h2>
          <p>No payouts or deductions in the last 7 days.</p>
          <button type="button" className="secondary-button" onClick={() => setTab('rewards')}>Back to rewards</button>
        </div>
      )}
    </section>
  );
}

function ImpactView() {
  return (
    <section className="page-view impact-view">
      <div className="page-header impact-header">
        <div className="eyebrow">YOUR POSITIVE FOOTPRINT</div>
        <div className="header-row"><h1>Small actions. Lasting impact.</h1><span className="secondary-button small">Your impact summary</span></div>
      </div>
      <div className="impact-hero card-surface dark-green">
        <div className="hero-copy">
          <div className="eyebrow light">MATERIALS RECOVERED</div>
          <div className="impact-number">8.4<span>kg</span></div>
          <p>Recovered through your demo and verified collection loops.</p>
        </div>
      </div>
      <div className="impact-stats-grid">
        <article className="impact-stat card-surface"><div className="impact-icon">↻</div><span>Completed collections</span><strong>1</strong><small>Verified inside demo flow</small></article>
        <article className="impact-stat card-surface"><div className="impact-icon">▣</div><span>Recovery earnings</span><strong>₦2,850</strong><small>Illustrative total</small></article>
        <article className="impact-stat card-surface"><div className="impact-icon">◫</div><span>Reward points</span><strong>1,240</strong><small>EcoPoints available</small></article>
      </div>
      <div className="info-row">
        <div className="chart-card card-surface">
          <div className="chart-header"><span className="eyebrow">RECOVERY RHYTHM</span><span className="secondary-button small">Illustrative chart</span></div>
          <div className="bar-chart" aria-label="Weekly recovery rhythm">
            {weekBars.map((value, index) => <span key={index} title={`Day ${index + 1}: ${value}%`} style={{ height: `${value}%` }} />)}
          </div>
        </div>
        <div className="why-matters card-surface">
          <div className="chart-header"><span className="eyebrow">WHY IT MATTERS</span></div>
          <h2>Recovery creates a ripple.</h2>
          <ul className="matter-list">
            <li>Material is kept in circulation instead of landfill.</li>
            <li>Collection routines build cleaner neighbourhoods.</li>
            <li>Every action compounds into a larger sustainability loop.</li>
          </ul>
        </div>
      </div>
      <p className="impact-disclaimer">ⓘ &nbsp;Only demonstrated collection weights update automatically. Environmental outcomes beyond those weights are not calculated or verified.</p>
    </section>
  );
}

function WalkthroughModal({ onClose, onBegin }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="walkthrough-title">
      <div className="walkthrough-modal">
        <button type="button" className="close-button" onClick={onClose} aria-label="Close walkthrough">×</button>
        <div className="walkthrough-header"><div className="eyebrow">WELCOME</div><h2 id="walkthrough-title">EcoSync quick start</h2></div>
        <ol className="walkthrough-steps">
          <li><span className="step-marker">1.</span><div className="step-icon">◉</div><div><strong>Scan a material</strong><span>Choose PET bottles and view sorting advice.</span></div></li>
          <li><span className="step-marker">2.</span><div className="step-icon">▣</div><div><strong>Track collections</strong><span>Review status, pickup timing, and your activity log.</span></div></li>
          <li><span className="step-marker">3.</span><div className="step-icon">◫</div><div><strong>Earn rewards</strong><span>Turn recovery into EcoPoints and wallet balance.</span></div></li>
        </ol>
        <div className="modal-actions">
          <button type="button" className="cta-button dark large" onClick={onBegin}>Begin walkthrough →</button>
          <button type="button" className="secondary-button wide" onClick={onClose}>Skip</button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [showWalkthrough, setShowWalkthrough] = useState(true);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
        .page-view { animation: dashboard-enter 420ms cubic-bezier(.2,.75,.25,1) both; }
        .page-view .page-header, .page-view .stats-row, .page-view > .panel-card, .page-view .scanner-layout, .page-view .wallet-summary, .page-view .impact-hero, .page-view .impact-stats-grid, .page-view .info-row { animation: dashboard-rise 480ms cubic-bezier(.2,.75,.25,1) both; }
        .page-view .stats-row, .page-view .wallet-summary, .page-view .impact-stats-grid { animation-delay:70ms; }
        .page-view > .panel-card:nth-of-type(2), .page-view .info-row { animation-delay:130ms; }
        .panel-card:hover, .mini-stat:hover, .card-surface:hover { transform:translateY(-3px); box-shadow:0 12px 28px rgba(20,45,33,.09); }
        .nav-item:hover, .sample-item:hover, .cta-button:hover, .secondary-button:hover { transform:translateY(-2px); }
        .sample-item:active, .cta-button:active, .secondary-button:active { transform:scale(.98); }
        .sidebar-is-collapsed .sidebar-wordmark, .sidebar-is-collapsed .sidebar-label, .sidebar-is-collapsed .sidebar-toggle-label, .sidebar-is-collapsed .nav-label, .sidebar-is-collapsed .profile-copy, .sidebar-is-collapsed .profile-tag { opacity:0; width:0; overflow:hidden; pointer-events:none; white-space:nowrap; }
        .sidebar-is-collapsed .sidebar-collapse-button { width:48px; margin-left:auto; margin-right:auto; }
        .sidebar-is-collapsed .nav-item { justify-content:center; padding-left:8px; padding-right:8px; }
        .sidebar-is-collapsed .profile-card { justify-content:center; padding-left:6px; padding-right:6px; }
        .dashboard-logo { max-height: 40px; width: auto; margin-bottom: 12px; display: block; }
        
        /* Chat Trigger Button Style in Sidebar */
        .chatbot-trigger-btn { background: #f0fdf4 !important; color: #166534 !important; border: 1px solid #bbf7d0 !important; font-weight: 600; margin-top: auto; }
        .chatbot-trigger-btn:hover { background: #dcfce7 !important; }

        /* AI Scanner Telemetry Output Box */
        .ai-result-box { margin-top: 14px; padding: 16px; border-radius: 10px; background: #0f172a; color: #f8fafc; border: 1px solid #1e293b; }
        .ai-result-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .ai-result-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 10px; }
        .ai-result-metrics small { display: block; font-size: 11px; color: #94a3b8; }
        .ai-result-metrics strong { font-size: 15px; color: #fff; }
        .emerald-text { color: #38bdf8 !important; }
        .ai-advice { margin: 0; font-size: 12.5px !important; color: #cbd5e1 !important; line-height: 1.5; }
        .confidence-badge { font-size: 11px; font-weight: 700; color: #38bdf8; background: rgba(56, 189, 248, 0.15); padding: 3px 8px; border-radius: 999px; }
        .scan-laser { position: absolute; left: 0; right: 0; height: 2px; background: #38bdf8; box-shadow: 0 0 10px #38bdf8; animation: scan-sweep 1.8s ease-in-out infinite; pointer-events: none; }
        @keyframes scan-sweep { 0%, 100% { top: 10%; } 50% { top: 90%; } }

        @keyframes dashboard-enter { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes dashboard-rise { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @media (min-width: 900px) { .sidebar-is-collapsed .sidebar { width:88px; min-width:88px; } .sidebar-is-collapsed .main-panel { min-width:0; } }
        @media (max-width: 899px) { .sidebar-collapse-button { display:none; } .sidebar-is-collapsed .sidebar-wordmark, .sidebar-is-collapsed .sidebar-label, .sidebar-is-collapsed .nav-label, .sidebar-is-collapsed .profile-copy, .sidebar-is-collapsed .profile-tag { opacity:initial; width:auto; overflow:visible; pointer-events:auto; } .sidebar-is-collapsed .nav-item { justify-content:initial; } .sidebar-is-collapsed .profile-card { justify-content:initial; } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration:.01ms !important; animation-iteration-count:1 !important; scroll-behavior:auto !important; transition-duration:.01ms !important; } }
      `}</style>

      <Sidebar 
        active={activeView} 
        setActive={setActiveView} 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed((value) => !value)} 
        onOpenChat={() => setIsChatOpen(true)}
      />

      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumb"><span>EcoSync</span><span className="crumb-divider">/</span><span>{pageTitle}</span></div>
          <div className="topbar-actions">
            <button type="button" className="secondary-button small" onClick={() => setIsChatOpen(true)}>💬 Ask EcoBot</button>
            <button type="button" className="secondary-button small" onClick={() => setShowWalkthrough(true)}>Quick guide</button>
          </div>
        </header>

        <div key={activeView}>{renderedView}</div>

        <EcoBotChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

        {showWalkthrough && <WalkthroughModal onClose={() => setShowWalkthrough(false)} onBegin={beginWalkthrough} />}
        {walkthroughStep > 0 && <div className="walkthrough-progress" role="status">Walkthrough started · Step {walkthroughStep} of 5<button type="button" onClick={() => setWalkthroughStep(0)}>End</button></div>}
      </main>
    </div>
  );
}
