import { useEffect, useRef, useState } from 'react';
import logo from './logo.jpg';

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

function Sidebar({ active, setActive, collapsed, onToggle, sidebarRef, onOpenChat }) {
  return (
    <aside ref={sidebarRef} className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-brand">
        <span className="sidebar-wordmark">EcoSync</span>
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
      </div>

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

        <div className="profile-card" style={{ marginTop: '8px' }}>
          <div className="profile-avatar">A</div>
          <div className="profile-copy">
            <strong>Ogunmepon Okechukwu</strong>
            <span>Household demo account</span>
          </div>
          <span className="profile-tag">Demo</span>
        </div>
      </div>
    </aside>
  );
}

function MobileBottomNav({ active, setActive, onOpenChat }) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {navItems.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => setActive(item.id)}
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            <span className="mobile-nav-label">{item.shortLabel}</span>
          </button>
        );
      })}
      <button type="button" className="mobile-nav-item" onClick={onOpenChat}>
        <span className="mobile-nav-icon">🤖</span>
        <span className="mobile-nav-label">EcoBot</span>
      </button>
    </nav>
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
        <h1>Identify &amp; classify waste.</h1>
        <p>Take a live photo or upload an image to generate sorting telemetry and reward estimates.</p>
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
                  <button type="button" className="cta-button dark" onClick={takePhoto}>Snap photo</button>
                  <button type="button" className="secondary-button" onClick={() => fileInputRef.current?.click()}>Upload instead</button>
                  <button type="button" className="secondary-button" onClick={stopCamera}>Close</button>
                </div>
              </>
            ) : capturedPhoto ? (
              <>
                <div className="camera-live-frame">
                  <img className="camera-video" src={capturedPhoto} alt="Captured material for AI scan" />
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
                <p>Snap a live photo or upload an image</p>
                <small>Supports JPG, PNG, WEBP or direct device camera</small>
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
            {[58, 40, 68, 82, 52, 78, 66].map((value, index) => <span key={index} title={`Day ${index + 1}: ${value}%`} style={{ height: `${value}%` }} />)}
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

function EcoBotChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi Ogunmepon! I am EcoBot, your AI recycling and sustainability assistant. Ask me anything about waste sorting, Hub rates, or how to redeem EcoPoints!' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  function handleSend(e) {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    const updatedMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(updatedMessages);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI API response logic
    setTimeout(() => {
      let botReply = "That's a great question regarding recycling! To maximize your yield, ensure materials are clean, dry, and categorized properly before scheduling a pickup at Hub #04.";
      
      const lower = userText.toLowerCase();
      if (lower.includes('rate') || lower.includes('price') || lower.includes('pay')) {
        botReply = "Current hub rates: PET bottles pay ₦150/kg, Aluminium cans pay ₦450/kg, and Cartons pay ₦90/kg. Payouts are credited instantly to your EcoWallet upon verification.";
      } else if (lower.includes('point') || lower.includes('eco')) {
        botReply = "You currently have 1,240 EcoPoints available in Tier 2. You can redeem them for utility discounts or convert them directly to NGN once you hit 1,500 points.";
      } else if (lower.includes('plastic') || lower.includes('bottle')) {
        botReply = "For PET bottles: rinse thoroughly, crush flat to save space, and keep caps separate for high-grade polymer recovery!";
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
      setIsTyping(false);
    }, 700);
  }

  return (
    <div className="chat-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="chat-drawer">
        <div className="chat-header">
          <div className="chat-title-group">
            <span className="chat-avatar-icon">🤖</span>
            <div>
              <h3>EcoBot Assistant</h3>
              <span className="chat-status">● Powered by Gemini API</span>
            </div>
          </div>
          <button type="button" className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="chat-messages" ref={chatScrollRef}>
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-bubble ${m.sender}`}>
              <div className="bubble-text">{m.text}</div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble bot typing-indicator">
              <span /> <span /> <span />
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="chat-input-bar">
          <input
            type="text"
            placeholder="Ask about rates, sorting rules, or points..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button type="submit" className="cta-button dark">Send</button>
        </form>
      </div>
    </div>
  );
}

function WalkthroughModal({ onClose, onBegin }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="walkthrough-title">
      <div className="walkthrough-modal">
        <button type="button" className="close-button" onClick={onClose} aria-label="Close walkthrough">×</button>
        <div className="walkthrough-header"><div className="eyebrow">WELCOME</div><h2 id="walkthrough-title">EcoSync quick start</h2></div>
        <ol className="walkthrough-steps">
          <li><span className="step-marker">1.</span><div><strong>Scan a material</strong><span>Choose PET bottles or upload an image and view AI sorting advice.</span></div></li>
          <li><span className="step-marker">2.</span><div><strong>Track collections</strong><span>Review status, pickup timing, and your activity log.</span></div></li>
          <li><span className="step-marker">3.</span><div><strong>Ask EcoBot</strong><span>Chat with our AI assistant for instant guidance on recycling rules.</span></div></li>
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

  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!sidebarCollapsed && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarCollapsed(true);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarCollapsed]);

  const pageTitle = navItems.find((item) => item.id === activeView)?.label ?? 'Overview';
  const goToScanner = () => setActiveView('scanner');
  const beginWalkthrough = () => { setShowWalkthrough(false); setActiveView('scanner'); setWalkthroughStep(1); };
  
  const renderedView = 
    activeView === 'overview' ? <OverviewView onScan={goToScanner} onNavigate={setActiveView} /> : 
    activeView === 'collections' ? <CollectionsView onScan={goToScanner} /> : 
    activeView === 'wallet' ? <WalletView /> : 
    activeView === 'scanner' ? <ScannerView /> : <ImpactView />;

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      <style>{`
        :root {
          --bg-canvas: #f8fafc;
          --bg-surface: #ffffff;
          --text-primary: #0f172a;
          --text-secondary: #475569;
          --border-color: #e2e8f0;
          --brand-primary: #0284c7;
        }

        body { margin: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg-canvas); color: var(--text-primary); }
        .app-shell { display: flex; min-height: 100vh; background: var(--bg-canvas); }
        
        .sidebar {
          width: 260px; min-width: 260px; background: #ffffff; border-right: 1px solid var(--border-color);
          display: flex; flex-direction: column; padding: 20px 14px;
          transition: width 220px cubic-bezier(.2,.75,.25,1), min-width 220px cubic-bezier(.2,.75,.25,1); z-index: 30;
        }
        .sidebar.sidebar-collapsed { width: 80px; min-width: 80px; }
        .sidebar-brand { display: flex; align-items: center; justify-content: space-between; padding: 4px 6px 20px; border-bottom: 1px solid var(--border-color); margin-bottom: 18px; }
        .sidebar-wordmark { font-weight: 700; font-size: 17px; color: var(--text-primary); }
        .sidebar-collapse-button { background: #f1f5f9; border: 1px solid var(--border-color); color: var(--text-secondary); border-radius: 8px; width: 30px; height: 30px; cursor: pointer; display: grid; place-items: center; }
        .sidebar-collapse-button:hover { background: #e2e8f0; color: var(--text-primary); }

        .sidebar-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: #94a3b8; padding: 0 10px 8px; }
        .side-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .nav-item {
          display: flex; align-items: center; gap: 12px; width: 100%; padding: 10px 12px;
          border: 1px solid transparent; border-radius: 10px; background: transparent;
          color: var(--text-secondary); font-size: 14px; font-weight: 500; cursor: pointer; text-align: left;
        }
        .nav-item:hover { background: #f1f5f9; color: var(--text-primary); }
        .nav-item.active { background: #e0f2fe; color: #0369a1; font-weight: 600; border-color: #bae6fd; }
        .chatbot-trigger-btn { background: #f0fdf4 !important; color: #166534 !important; border: 1px solid #bbf7d0 !important; font-weight: 600; }
        .chatbot-trigger-btn:hover { background: #dcfce7 !important; }

        .nav-icon { font-size: 16px; width: 20px; text-align: center; }
        .nav-dot { width: 6px; height: 6px; border-radius: 50%; background: #0284c7; margin-left: auto; }

        .sidebar-footer { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 6px; }
        .profile-card { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 10px; background: #f8fafc; border: 1px solid var(--border-color); }
        .profile-avatar { width: 32px; height: 32px; border-radius: 8px; background: #e2e8f0; color: #334155; font-weight: 700; display: grid; place-items: center; flex-shrink: 0; }
        .profile-copy { display: flex; flex-direction: column; min-width: 0; flex: 1; }
        .profile-copy strong { font-size: 12.5px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .profile-copy span { font-size: 11px; color: var(--text-secondary); }
        .profile-tag { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: #f1f5f9; color: #64748b; }

        .sidebar-is-collapsed .sidebar-wordmark,
        .sidebar-is-collapsed .sidebar-label,
        .sidebar-is-collapsed .nav-label,
        .sidebar-is-collapsed .profile-copy,
        .sidebar-is-collapsed .profile-tag,
        .sidebar-is-collapsed .nav-dot { display: none; }
        .sidebar-is-collapsed .sidebar-brand { justify-content: center; }
        .sidebar-is-collapsed .nav-item { justify-content: center; padding: 10px 0; }
        .sidebar-is-collapsed .profile-card { justify-content: center; padding: 6px; }

        .main-panel { flex: 1; display: flex; flex-direction: column; min-width: 0; padding: 0 28px 40px; background: #f8fafc; }
        .topbar { display: flex; align-items: center; justify-content: space-between; height: 64px; border-bottom: 1px solid var(--border-color); margin-bottom: 24px; gap: 12px; }
        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: #64748b; }
        .breadcrumb span:last-child { color: var(--text-primary); font-weight: 600; }
        .topbar-actions { display: flex; align-items: center; gap: 8px; }

        .panel-card, .mini-stat, .card-surface {
          background: #ffffff; border: 1px solid var(--border-color); border-radius: 12px; padding: 22px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          transition: transform 200ms ease, box-shadow 200ms ease;
        }
        .panel-card:hover, .mini-stat:hover, .card-surface:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06); }

        .cta-button, .secondary-button {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 10px 18px; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; border: 1px solid transparent;
        }
        .cta-button.dark { background: #0f172a; color: #ffffff; }
        .cta-button.dark:hover { background: #1e293b; }
        .secondary-button { background: #ffffff; color: var(--text-primary); border-color: var(--border-color); }
        .secondary-button:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .secondary-button.small { padding: 6px 12px; font-size: 12.5px; }

        /* Scanner Styling */
        .scanner-layout { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 20px; align-items: start; }
        @media (max-width: 850px) { .scanner-layout { grid-template-columns: 1fr; } }
        .panel-topline, .sample-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .panel-badge { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; }
        .mini-icon { color: #0284c7; }
        .step-indicator { font-size: 11px; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 3px 8px; border-radius: 999px; }

        .camera-box { margin-top: 12px; border: 2px dashed #cbd5e1; border-radius: 10px; background: #f8fafc; padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .camera-box.camera-box-live { border-style: solid; border-color: #0f172a; background: #0f172a; color: #fff; padding: 16px; }
        .camera-box p { margin: 4px 0 0; font-weight: 600; font-size: 14.5px; }
        .camera-box-live p { color: #fff; }
        .camera-box small { color: #64748b; font-size: 12px; }
        .camera-box-live small { color: #94a3b8; }

        .camera-frame { width: 120px; height: 120px; position: relative; display: grid; place-items: center; margin-bottom: 8px; }
        .frame-corner { position: absolute; width: 18px; height: 18px; border-color: #0284c7; border-style: solid; }
        .top-left { top: 0; left: 0; border-width: 3px 0 0 3px; border-top-left-radius: 6px; }
        .top-right { top: 0; right: 0; border-width: 3px 3px 0 0; border-top-right-radius: 6px; }
        .bottom-left { bottom: 0; left: 0; border-width: 0 0 3px 3px; border-bottom-left-radius: 6px; }
        .bottom-right { bottom: 0; right: 0; border-width: 0 3px 3px 0; border-bottom-right-radius: 6px; }
        .camera-icon { font-size: 32px; color: #0284c7; }

        .camera-live-frame { position: relative; width: 100%; height: 260px; border-radius: 8px; overflow: hidden; background: #000; }
        .camera-video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .camera-live-indicator {
          position: absolute; top: 10px; left: 10px; display: inline-flex; align-items: center; gap: 6px;
          background: rgba(15, 23, 42, 0.85); color: #38bdf8; font-size: 10.5px; font-weight: 700; padding: 4px 10px; border-radius: 999px;
        }
        .camera-live-indicator span { width: 6px; height: 6px; border-radius: 50%; background: #38bdf8; }

        .scan-laser {
          position: absolute; left: 0; right: 0; height: 2px; background: #38bdf8; box-shadow: 0 0 10px #38bdf8;
          animation: scan-sweep 1.8s ease-in-out infinite; pointer-events: none;
        }
        @keyframes scan-sweep { 0%, 100% { top: 10%; } 50% { top: 90%; } }

        .camera-controls { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 12px; width: 100%; }
        .camera-error { margin-top: 12px; padding: 10px; border-radius: 8px; background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; font-size: 13px; }

        .sample-grid { display: grid; grid-template-columns: 1fr; gap: 8px; margin: 14px 0; }
        .sample-item { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 10px; border: 1px solid var(--border-color); background: #ffffff; font-size: 13.5px; font-weight: 600; cursor: pointer; text-align: left; }
        .sample-item.selected { border-color: #0284c7; background: #f0f9ff; color: #0369a1; }
        .tick-pill { margin-left: auto; width: 20px; height: 20px; border-radius: 50%; background: #0284c7; color: #fff; font-size: 11px; display: grid; place-items: center; }

        .ai-result-box { margin-top: 14px; padding: 16px; border-radius: 10px; background: #0f172a; color: #f8fafc; border: 1px solid #1e293b; }
        .ai-result-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .ai-result-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 10px; }
        .ai-result-metrics small { display: block; font-size: 11px; color: #94a3b8; }
        .ai-result-metrics strong { font-size: 15px; color: #fff; }
        .emerald-text { color: #38bdf8 !important; }
        .ai-advice { margin: 0; font-size: 12.5px !important; color: #cbd5e1 !important; line-height: 1.5; }
        .confidence-badge { font-size: 11px; font-weight: 700; color: #38bdf8; background: rgba(56, 189, 248, 0.15); padding: 3px 8px; border-radius: 999px; }

        /* EcoBot Chat Drawer Styling */
        .chat-backdrop {
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5);
          display: flex; justify-content: flex-end; z-index: 100; backdrop-filter: blur(2px);
          animation: fadeIn 200ms ease;
        }
        .chat-drawer {
          width: 100%; max-width: 420px; background: #ffffff; height: 100%;
          display: flex; flex-direction: column; box-shadow: -10px 0 30px rgba(0,0,0,0.15);
          animation: slideLeft 250ms cubic-bezier(.2,.75,.25,1);
        }
        @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .chat-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid var(--border-color); background: #f8fafc; }
        .chat-title-group { display: flex; align-items: center; gap: 12px; }
        .chat-avatar-icon { font-size: 24px; width: 40px; height: 40px; border-radius: 10px; background: #e0f2fe; display: grid; place-items: center; }
        .chat-title-group h3 { margin: 0; font-size: 16px; font-weight: 700; }
        .chat-status { font-size: 11px; color: #0284c7; font-weight: 600; }
        .close-button { background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 18px; cursor: pointer; display: grid; place-items: center; }
        
        .chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; background: #f8fafc; }
        .chat-bubble { max-width: 82%; padding: 12px 16px; border-radius: 14px; font-size: 13.5px; line-height: 1.5; }
        .chat-bubble.bot { background: #ffffff; color: var(--text-primary); border: 1px solid var(--border-color); align-self: flex-start; border-bottom-left-radius: 4px; }
        .chat-bubble.user { background: #0284c7; color: #ffffff; align-self: flex-end; border-bottom-right-radius: 4px; }
        .typing-indicator span { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #94a3b8; animation: bounce 1.4s infinite ease-in-out both; margin: 0 2px; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }

        .chat-input-bar { padding: 16px 20px; background: #ffffff; border-top: 1px solid var(--border-color); display: flex; gap: 10px; }
        .chat-input-bar input { flex: 1; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); font-size: 13.5px; outline: none; }
        .chat-input-bar input:focus { border-color: #0284c7; box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1); }

        /* General layout helpers */
        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin-bottom: 20px; }
        .mini-stat { display: flex; flex-direction: column; gap: 4px; }
        .mini-stat .value { font-size: 28px; font-weight: 700; color: var(--text-primary); }
        .mini-stat .label { font-size: 13px; color: var(--text-secondary); }
        .overview-action-buttons { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }

        .modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); display: grid; place-items: center; padding: 20px; z-index: 50; }
        .walkthrough-modal { background: #fff; border-radius: 16px; max-width: 440px; width: 100%; padding: 28px; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
        .walkthrough-steps { list-style: none; padding: 0; margin: 18px 0 24px; display: flex; flex-direction: column; gap: 14px; }
        .walkthrough-steps li { display: flex; gap: 12px; align-items: flex-start; }
        .step-marker { font-size: 11px; font-weight: 800; color: #0369a1; background: #e0f2fe; padding: 4px 8px; border-radius: 6px; }
        .modal-actions { display: flex; gap: 10px; }
        .modal-actions .cta-button { flex: 1; }
        .walkthrough-progress { position: fixed; bottom: 20px; right: 24px; background: #0f172a; color: #fff; padding: 10px 16px; border-radius: 999px; font-size: 12.5px; display: flex; align-items: center; gap: 12px; z-index: 40; }
        .walkthrough-progress button { background: rgba(255,255,255,0.2); border: none; color: #fff; padding: 3px 10px; border-radius: 999px; cursor: pointer; font-size: 11px; }

        .mobile-bottom-nav { display: none; }
        @media (max-width: 767px) {
          .sidebar { display: none; }
          .main-panel { padding: 0 16px calc(80px + env(safe-area-inset-bottom)); }
          .mobile-bottom-nav {
            position: fixed; bottom: 0; left: 0; right: 0;
            display: grid; grid-template-columns: repeat(6, 1fr);
            background: #ffffff; border-top: 1px solid var(--border-color);
            padding: 6px 4px calc(8px + env(safe-area-inset-bottom)); z-index: 60;
          }
          .mobile-nav-item {
            display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
            background: transparent; border: none; color: #64748b; padding: 6px 2px; cursor: pointer; font-size: 9.5px; font-weight: 600;
          }
          .mobile-nav-icon { font-size: 17px; }
          .mobile-nav-item.active { color: #0284c7; }
        }
      `}</style>

      <Sidebar
        active={activeView}
        setActive={setActiveView}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((value) => !value)}
        sidebarRef={sidebarRef}
        onOpenChat={() => setIsChatOpen(true)}
      />

      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumb">
            <span>EcoSync</span>
            <span>/</span>
            <span>{pageTitle}</span>
          </div>
          <div className="topbar-actions">
            <button type="button" className="secondary-button small" onClick={() => setIsChatOpen(true)}>
              💬 Ask EcoBot
            </button>
            <button type="button" className="secondary-button small" onClick={() => setShowWalkthrough(true)}>
              Quick guide
            </button>
          </div>
        </header>

        <div key={activeView}>{renderedView}</div>

        <EcoBotChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

        {showWalkthrough && (
          <WalkthroughModal onClose={() => setShowWalkthrough(false)} onBegin={beginWalkthrough} />
        )}

        {walkthroughStep > 0 && (
          <div className="walkthrough-progress" role="status">
            <span>Demo walkthrough · Step {walkthroughStep} of 5</span>
            <button type="button" onClick={() => setWalkthroughStep(0)}>End</button>
          </div>
        )}
      </main>

      <MobileBottomNav active={activeView} setActive={setActiveView} onOpenChat={() => setIsChatOpen(true)} />
    </div>
  );
}
