import { useEffect, useRef, useState } from 'react';
import logo from './logo.jpg';

const navItems = [
  { id: 'overview', label: 'Overview', shortLabel: 'Home', icon: '⌂' },
  { id: 'scanner', label: 'AI Scanner', shortLabel: 'Scan', icon: '⛶' },
  { id: 'collections', label: 'Collections', shortLabel: 'Pickups', icon: '◫' },
  { id: 'wallet', label: 'EcoWallet', shortLabel: 'Wallet', icon: '◈' },
  { id: 'impact', label: 'My Impact', shortLabel: 'Impact', icon: '✦' },
];

const sampleOptions = [
  { label: 'PET bottles', icon: '🥤', rate: '₦150/kg', points: '+120 pts', advice: 'Rinse, crush flat, and keep caps separate for high-grade polymer recovery.' },
  { label: 'Aluminium cans', icon: '🥫', rate: '₦450/kg', points: '+210 pts', advice: 'Empty liquids completely. Do not mix with steel or tin cans.' },
  { label: 'Cartons', icon: '📦', rate: '₦90/kg', points: '+80 pts', advice: 'Flatten dry corrugated cardboard and remove heavy plastic packing tape.' },
  { label: 'Glass waste', icon: '🥛', rate: '₦110/kg', points: '+95 pts', advice: 'Separate clear and colored glass. Keep intact to avoid contamination.' },
  { label: 'Organic waste', icon: '🌿', rate: '₦40/kg', points: '+50 pts', advice: 'Suitable for municipal biogas & composting hubs. Keep free of plastics.' },
];

const stats = [
  { label: 'Completed collections', value: '1', detail: 'Verified inside demo flow' },
  { label: 'Recovery earnings', value: '₦2,850', detail: 'Illustrative total' },
  { label: 'Reward points', value: '1,240', detail: 'EcoPoints available' },
];

const weekBars = [58, 40, 68, 82, 52, 78, 66];

function Sidebar({ active, setActive, collapsed, onToggle, sidebarRef }) {
  return (
    <aside ref={sidebarRef} className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-mark">E</div>
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

      <div className="sidebar-label">WORKSPACE</div>

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
        <div className="system-status">
          <span className="status-pulse" />
          <span className="nav-label">AI Vision Engine Online</span>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">O</div>
          <div className="profile-copy">
            <strong>Ogunmepon Okechukwu</strong>
            <span>Household demo account</span>
          </div>
          <span className="profile-tag">DEMO</span>
        </div>
      </div>
    </aside>
  );
}

function MobileBottomNav({ active, setActive }) {
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
    </nav>
  );
}

function OverviewView({ onScan, onNavigate }) {
  const [selectedRateIndex, setSelectedRateIndex] = useState(0);
  const activeRate = sampleOptions[selectedRateIndex];

  const recoveredKg = 8.4;
  const targetKg = 15.0;
  const progressPercent = Math.min(100, Math.round((recoveredKg / targetKg) * 100));

  return (
    <section className="page-view overview-view">
      <div className="page-header compact-header overview-hero-header">
        <div>
          <div className="eyebrow">HOME / EXECUTIVE OVERVIEW</div>
          <h1>Good to see you, Ogunmepon</h1>
          <p>Real-time telemetry of your material recovery, points, and circular impact.</p>
        </div>
        <div className="hero-cta-desktop">
          <button type="button" className="cta-button dark" onClick={onScan}>
            + Launch AI Scanner
          </button>
        </div>
      </div>

      <div className="stats-row">
        <article className="mini-stat">
          <div className="stat-top">
            <span className="stat-tag">VERIFIED BATCHES</span>
            <span className="stat-delta positive">+1 this week</span>
          </div>
          <span className="value">1</span>
          <span className="label">Collections logged</span>
        </article>

        <article className="mini-stat">
          <div className="stat-top">
            <span className="stat-tag">RECOVERY VALUE</span>
            <span className="stat-delta">NGN</span>
          </div>
          <span className="value">₦2,850</span>
          <span className="label">Illustrative earnings</span>
        </article>

        <article className="mini-stat accent-border">
          <div className="stat-top">
            <span className="stat-tag">REWARD BALANCE</span>
            <span className="stat-delta positive">Tier 2</span>
          </div>
          <span className="value">1,240</span>
          <span className="label">EcoPoints available</span>
        </article>
      </div>

      <div className="smart-widgets-grid">
        <article className="panel-card widget-card">
          <div className="panel-heading-row">
            <div className="eyebrow">TIER MILESTONE</div>
            <span className="badge-pill">{progressPercent}% to Silver</span>
          </div>
          <h3>Monthly Recovery Goal</h3>
          <p className="widget-sub">
            <strong>{recoveredKg} kg</strong> of <strong>{targetKg} kg</strong> target diverted.
          </p>

          <div className="progress-track" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="widget-footer-row">
            <span className="muted-note">{(targetKg - recoveredKg).toFixed(1)} kg remaining for +500 bonus pts</span>
            <button type="button" className="link-action" onClick={() => onNavigate('impact')}>
              Metrics →
            </button>
          </div>
        </article>

        <article className="panel-card widget-card">
          <div className="panel-heading-row">
            <div className="eyebrow">LIVE HUB RATES</div>
            <span className="status-badge success">● Active</span>
          </div>
          <h3>Material Yield Estimator</h3>

          <div className="rate-pills" role="tablist" aria-label="Material rates">
            {sampleOptions.slice(0, 4).map((item, idx) => (
              <button
                key={item.label}
                type="button"
                className={`rate-pill ${selectedRateIndex === idx ? 'active' : ''}`}
                onClick={() => setSelectedRateIndex(idx)}
              >
                {item.icon} {item.label.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="rate-display-box">
            <div>
              <small>{activeRate.label}</small>
              <strong>{activeRate.rate}</strong>
            </div>
            <div className="rate-points-tag">{activeRate.points} / batch</div>
          </div>

          <div className="widget-footer-row">
            <span className="muted-note">Instant payout via EcoWallet</span>
            <button type="button" className="link-action" onClick={onScan}>
              Scan now →
            </button>
          </div>
        </article>

        <article className="panel-card widget-card">
          <div className="panel-heading-row">
            <div className="eyebrow">LOGISTICS FEED</div>
            <span className="badge-pill">Hub #04</span>
          </div>
          <h3>Dispatch &amp; Recent Batch</h3>

          <div className="compact-activity-item">
            <div className="activity-dot" />
            <div className="activity-text">
              <strong>PET plastic bottles · 8.4 kg</strong>
              <span>Settled Mar 12 · +₦2,850 credited</span>
            </div>
          </div>

          <div className="widget-action-pair">
            <button type="button" className="cta-button dark full-btn" onClick={onScan}>
              Scan / Upload Waste
            </button>
            <button type="button" className="secondary-button full-btn" onClick={() => onNavigate('collections')}>
              Pickups
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function ScannerView() {
  const [selectedSample, setSelectedSample] = useState('PET bottles');
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState('');
  const [imageSource, setImageSource] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentSampleObj = sampleOptions.find((s) => s.label === selectedSample) || sampleOptions[0];

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [stream]);

  function stopCamera() {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  }

  function runSimulatedAnalysis(materialLabel) {
    setIsAnalyzing(true);
    setScanResult(null);
    setTimeout(() => {
      const match = sampleOptions.find((s) => s.label === materialLabel) || sampleOptions[0];
      setIsAnalyzing(false);
      setScanResult({
        material: match.label,
        confidence: (94.2 + Math.random() * 4.5).toFixed(1),
        rate: match.rate,
        points: match.points,
        advice: match.advice,
      });
    }, 750);
  }

  async function openCamera() {
    setCameraError('');
    setCapturedPhoto('');
    setScanResult(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is unavailable in this browser. Upload an image instead.');
      return;
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: 'environment' } },
      });
      setStream(mediaStream);
    } catch (error) {
      if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
        setCameraError('Camera permission denied. Allow access in settings or upload a photo.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('No camera detected on this device. Use "Upload photo" instead.');
      } else {
        setCameraError('Could not initialize camera. Ensure no other app is using it, or upload a photo.');
      }
    }
  }

  function takePhoto() {
    const video = videoRef.current;
    if (!video?.videoWidth) {
      setCameraError('Camera sensor is still warming up. Please try again in a moment.');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(dataUrl);
    setImageSource('camera');
    stopCamera();
    runSimulatedAnalysis(selectedSample);
  }

  function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setCameraError('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    setCameraError('');
    stopCamera();

    const reader = new FileReader();
    reader.onload = () => {
      setCapturedPhoto(reader.result);
      setImageSource('upload');
      runSimulatedAnalysis(selectedSample);
    };
    reader.onerror = () => {
      setCameraError('Failed to read the uploaded file. Please try another image.');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  function clearCapture() {
    setCapturedPhoto('');
    setImageSource('');
    setScanResult(null);
    setCameraError('');
  }

  const currentStep = scanResult ? '03' : capturedPhoto ? '02' : '01';

  return (
    <section className="page-view scanner-view">
      <div className="page-header compact-header">
        <div className="eyebrow">AI VISION ENGINE / MATERIAL CLASSIFICATION</div>
        <h1>Identify &amp; classify waste.</h1>
        <p>Snap a live photo or upload an image to generate sorting telemetry and reward estimates.</p>
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
            <div className="panel-badge">
              <span className="mini-icon">◉</span>Optical Sensor &amp; Upload
            </div>
            <span className="step-indicator">STEP {currentStep} OF 03</span>
          </div>

          <div className={`camera-box ${stream || capturedPhoto ? 'camera-box-live' : ''}`}>
            {stream ? (
              <>
                <div className="camera-live-frame">
                  <video
                    ref={videoRef}
                    className="camera-video"
                    autoPlay
                    muted
                    playsInline
                    aria-label="Live camera preview"
                  />
                  <div className="scan-laser" />
                  <span className="camera-live-indicator">
                    <span /> LIVE FEED
                  </span>
                </div>
                <p>Align waste item inside the frame</p>
                <small>Ensure clear lighting for optimal material detection</small>
                <div className="camera-controls">
                  <button type="button" className="cta-button dark" onClick={takePhoto}>
                    Snap photo
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload instead
                  </button>
                  <button type="button" className="secondary-button" onClick={stopCamera}>
                    Close
                  </button>
                </div>
              </>
            ) : capturedPhoto ? (
              <>
                <div className="camera-live-frame">
                  <img
                    className="camera-video"
                    src={capturedPhoto}
                    alt="Material submitted for AI scan"
                  />
                  {isAnalyzing && <div className="scan-laser" />}
                  <span className="camera-live-indicator">
                    <span /> {imageSource === 'upload' ? 'UPLOADED IMAGE' : 'CAPTURED FRAME'}
                  </span>
                </div>
                <p>{isAnalyzing ? 'Analyzing material composition...' : 'Image verified for recovery'}</p>
                <small>Processed locally in your browser session</small>
                <div className="camera-controls">
                  <button type="button" className="cta-button dark" onClick={openCamera}>
                    Retake photo
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload new
                  </button>
                  <button type="button" className="secondary-button" onClick={clearCapture}>
                    Reset
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="camera-frame" aria-label="Camera view">
                  <span className="frame-corner top-left" />
                  <span className="frame-corner top-right" />
                  <span className="frame-corner bottom-left" />
                  <span className="frame-corner bottom-right" />
                  <div className="camera-illustration">
                    <span className="camera-icon">⛶</span>
                  </div>
                </div>
                <p>Snap a live photo or upload an image</p>
                <small>Supports JPG, PNG, WEBP or direct device camera</small>
                <div className="camera-controls">
                  <button type="button" className="cta-button dark" onClick={openCamera}>
                    Open camera
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    ↑ Upload photo
                  </button>
                </div>
              </>
            )}
          </div>

          {cameraError && (
            <p className="camera-error" role="alert">
              {cameraError}
            </p>
          )}
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
                  if (capturedPhoto) runSimulatedAnalysis(sample.label);
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
                {scanResult ? `${scanResult.confidence}% MATCH` : 'CALIBRATED'}
              </span>
            </div>
            <div className="ai-result-metrics">
              <div>
                <small>Detected Class</small>
                <strong>{selectedSample}</strong>
              </div>
              <div>
                <small>Est. Yield</small>
                <strong className="emerald-text">{currentSampleObj.points}</strong>
              </div>
            </div>
            <p className="ai-advice">{currentSampleObj.advice}</p>
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
        <div className="eyebrow">LOGISTICS &amp; DISPATCH</div>
        <div className="header-row">
          <h1>My collections</h1>
          <button type="button" className="cta-button dark" onClick={onScan}>
            + New scan
          </button>
        </div>
        <p>Track verified material batches moving through local circular recovery hubs.</p>
      </div>

      <div className="stats-row">
        <article className="mini-stat">
          <span className="value">1</span>
          <span className="label">Total demo collections</span>
        </article>
        <article className="mini-stat">
          <span className="value">0</span>
          <span className="label">Awaiting pickup</span>
        </article>
        <article className="mini-stat">
          <span className="value">1</span>
          <span className="label">Verified &amp; settled</span>
        </article>
      </div>

      <div className="panel-card schedule-panel">
        <div className="panel-heading-row">
          <div className="eyebrow">DISPATCH QUEUE</div>
          <span className="status-badge success">● System Ready</span>
        </div>
        <h2>Upcoming pickups</h2>
        <div className="empty-state emphasis">
          <div className="empty-icon">▣</div>
          <h3>No pickups pending</h3>
          <p>Capture or upload a material batch in the AI Scanner to schedule your next pickup.</p>
          <button type="button" className="scan-button secondary-button" onClick={onScan}>
            Schedule a collection
          </button>
        </div>
      </div>

      <div className="panel-card collection-history">
        <div className="panel-heading-row">
          <div className="eyebrow">VERIFIED LEDGER</div>
        </div>
        <h2>Past collections</h2>
        <div className="history-item">
          <div className="history-icon">◫</div>
          <div className="history-copy">
            <div className="history-mainline">
              <span className="pill">PET plastic bottles · 8.4 kg</span>
              <span className="history-date">Mar 12</span>
            </div>
            <p>Recovered &amp; settled via Lagos Circular Hub #04</p>
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
        <div className="eyebrow">TREASURY &amp; INCENTIVES</div>
        <div className="header-row">
          <h1>EcoWallet</h1>
          <button type="button" className="secondary-button small" onClick={() => setTab('activity')}>
            View ledger
          </button>
        </div>
      </div>

      <div className="wallet-summary">
        <div className="wallet-balance card-surface dark-card">
          <div className="wallet-topline">
            <span className="brand-name">EcoSync Treasury</span>
            <span className="wallet-label">NGN WALLET</span>
          </div>
          <div className="wallet-total">₦41,200</div>
          <small>Available payout balance</small>
        </div>
        <div className="points-balance card-surface soft-green">
          <div className="wallet-icon">◈</div>
          <div className="points-label">Available EcoPoints</div>
          <div className="points-value">
            1,240 <small>pts</small>
          </div>
        </div>
      </div>

      <div className="wallet-tabs">
        <button
          className={`tab-button ${tab === 'rewards' ? 'active' : ''}`}
          type="button"
          aria-pressed={tab === 'rewards'}
          onClick={() => setTab('rewards')}
        >
          Rewards summary
        </button>
        <button
          className={`tab-button ${tab === 'activity' ? 'active' : ''}`}
          type="button"
          aria-pressed={tab === 'activity'}
          onClick={() => setTab('activity')}
        >
          Wallet activity
        </button>
      </div>

      {tab === 'rewards' ? (
        <div className="reward-grid">
          {stats.map((stat) => (
            <article className="wallet-stat card-surface" key={stat.label}>
              <div className="wallet-stat-icon">
                {stat.label.includes('Completed') ? '✓' : stat.label.includes('Recovery') ? '₦' : '◈'}
              </div>
              <div>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
                <small>{stat.detail}</small>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="panel-card">
          <h2>Recent wallet activity</h2>
          <p>No payouts or deductions recorded in the last 7 days.</p>
          <button type="button" className="secondary-button" style={{ marginTop: '12px' }} onClick={() => setTab('rewards')}>
            Back to rewards
          </button>
        </div>
      )}
    </section>
  );
}

function ImpactView() {
  return (
    <section className="page-view impact-view">
      <div className="page-header impact-header">
        <div className="eyebrow">ESG &amp; CIRCULAR TELEMETRY</div>
        <div className="header-row">
          <h1>Small actions. Lasting impact.</h1>
          <span className="badge-pill">Verified Demo Metrics</span>
        </div>
      </div>

      <div className="impact-hero card-surface dark-green">
        <div className="hero-copy">
          <div className="eyebrow light">TOTAL MATERIALS DIVERTED</div>
          <div className="impact-number">
            8.4<span>kg</span>
          </div>
          <p>Recovered and diverted from landfill through verified collection loops.</p>
        </div>
      </div>

      <div className="impact-stats-grid">
        <article className="impact-stat card-surface">
          <div className="impact-icon">↻</div>
          <span>Completed collections</span>
          <strong>1</strong>
          <small>Verified inside demo flow</small>
        </article>
        <article className="impact-stat card-surface">
          <div className="impact-icon">₦</div>
          <span>Recovery earnings</span>
          <strong>₦2,850</strong>
          <small>Illustrative total</small>
        </article>
        <article className="impact-stat card-surface">
          <div className="impact-icon">◈</div>
          <span>Reward points</span>
          <strong>1,240</strong>
          <small>EcoPoints available</small>
        </article>
      </div>

      <div className="info-row">
        <div className="chart-card card-surface">
          <div className="chart-header">
            <span className="eyebrow">WEEKLY RECOVERY VELOCITY</span>
            <span className="badge-pill">7-Day Index</span>
          </div>
          <div className="bar-chart" aria-label="Weekly recovery rhythm">
            {weekBars.map((value, index) => (
              <div key={index} className="bar-col">
                <span title={`Day ${index + 1}: ${value}%`} style={{ height: `${value}%` }} />
                <small>D{index + 1}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="why-matters card-surface">
          <div className="chart-header">
            <span className="eyebrow">CIRCULAR VALUE</span>
          </div>
          <h2>Recovery creates a ripple.</h2>
          <ul className="matter-list">
            <li>High-purity polymers stay in local manufacturing loops.</li>
            <li>Structured collection routines build cleaner urban districts.</li>
            <li>Every verified scan compounds into measurable ESG value.</li>
          </ul>
        </div>
      </div>

      <p className="impact-disclaimer">
        ⓘ &nbsp;Only demonstrated collection weights update automatically. Environmental outcomes beyond those weights are illustrative.
      </p>
    </section>
  );
}

function WalkthroughModal({ onClose, onBegin }) {
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="walkthrough-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="walkthrough-modal">
        <button type="button" className="close-button" onClick={onClose} aria-label="Close walkthrough">
          ×
        </button>
        <div className="walkthrough-header">
          <div className="eyebrow">PLATFORM ONBOARDING</div>
          <h2 id="walkthrough-title">EcoSync quick start</h2>
        </div>
        <ol className="walkthrough-steps">
          <li>
            <span className="step-marker">01</span>
            <div>
              <strong>Scan or upload a material</strong>
              <span>Use live camera capture or upload an image for instant sorting telemetry.</span>
            </div>
          </li>
          <li>
            <span className="step-marker">02</span>
            <div>
              <strong>Track collections</strong>
              <span>Monitor pickup schedules, batch weights, and verification status.</span>
            </div>
          </li>
          <li>
            <span className="step-marker">03</span>
            <div>
              <strong>Earn rewards</strong>
              <span>Convert verified recovery into EcoPoints and NGN wallet balance.</span>
            </div>
          </li>
        </ol>
        <div className="modal-actions">
          <button type="button" className="cta-button dark large" onClick={onBegin}>
            Launch AI Scanner →
          </button>
          <button type="button" className="secondary-button wide" onClick={onClose}>
            Skip
          </button>
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

  const sidebarRef = useRef(null);

  // Auto-collapse sidebar on desktop when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (!sidebarCollapsed && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarCollapsed(true);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarCollapsed]);

  const pageTitle = navItems.find((item) => item.id === activeView)?.label ?? 'Overview';
  const goToScanner = () => setActiveView('scanner');
  const beginWalkthrough = () => {
    setShowWalkthrough(false);
    setActiveView('scanner');
    setWalkthroughStep(1);
  };

  const renderedView =
    activeView === 'overview' ? (
      <OverviewView onScan={goToScanner} onNavigate={setActiveView} />
    ) : activeView === 'collections' ? (
      <CollectionsView onScan={goToScanner} />
    ) : activeView === 'wallet' ? (
      <WalletView />
    ) : activeView === 'scanner' ? (
      <ScannerView />
    ) : (
      <ImpactView />
    );

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      <style>{`
        :root {
          --bg-canvas: #f3f6f8;
          --bg-surface: #ffffff;
          --bg-obsidian: #0b1614;
          --border-subtle: #e2e8f0;
          --border-strong: #cbd5e1;
          --text-primary: #0f172a;
          --text-secondary: #475569;
          --text-muted: #64748b;
          --emerald-core: #10b981;
          --emerald-dark: #059669;
          --radius-lg: 16px;
          --radius-md: 12px;
          --radius-sm: 8px;
          --shadow-card: 0 2px 12px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.03);
        }

        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--bg-canvas);
          color: var(--text-primary);
          -webkit-font-smoothing: antialiased;
        }

        /* App Shell */
        .app-shell { display: flex; min-height: 100vh; background: var(--bg-canvas); }
        .main-panel { flex: 1; display: flex; flex-direction: column; min-width: 0; padding: 0 28px 40px; }

        /* Desktop Sidebar */
        .sidebar {
          width: 264px;
          min-width: 264px;
          background: linear-gradient(180deg, var(--bg-obsidian) 0%, #0e1d1a 100%);
          color: #e2e8f0;
          display: flex;
          flex-direction: column;
          padding: 20px 14px;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          transition: width 200ms ease, min-width 200ms ease;
        }
        .sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 4px 6px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 18px; }
        .brand-mark { width: 32px; height: 32px; border-radius: 9px; background: linear-gradient(135deg, #10b981, #047857); color: #fff; font-weight: 800; display: grid; place-items: center; font-size: 15px; flex-shrink: 0; }
        .sidebar-wordmark { font-weight: 700; font-size: 17px; letter-spacing: -0.02em; color: #fff; flex: 1; }
        .sidebar-collapse-button { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; border-radius: 8px; width: 30px; height: 30px; cursor: pointer; display: grid; place-items: center; }
        .sidebar-collapse-button:hover { background: rgba(16,185,129,0.2); color: #fff; border-color: rgba(16,185,129,0.5); }

        .sidebar-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; color: #64748b; padding: 0 10px 8px; }
        .side-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .nav-item {
          display: flex; align-items: center; gap: 12px; width: 100%; padding: 11px 12px;
          border: 1px solid transparent; border-radius: var(--radius-md); background: transparent;
          color: #94a3b8; font-size: 14px; font-weight: 500; cursor: pointer; text-align: left;
        }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: #f8fafc; }
        .nav-item.active {
          background: linear-gradient(90deg, rgba(16,185,129,0.18), rgba(16,185,129,0.05));
          border-color: rgba(16,185,129,0.35);
          color: #ffffff;
          font-weight: 600;
        }
        .nav-icon { font-size: 16px; width: 20px; text-align: center; color: #10b981; flex-shrink: 0; }
        .nav-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; margin-left: auto; }

        .sidebar-footer { margin-top: auto; display: flex; flex-direction: column; gap: 12px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); }
        .system-status { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 8px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); font-size: 11px; color: #6ee7b7; }
        .status-pulse { width: 7px; height: 7px; border-radius: 50%; background: #10b981; flex-shrink: 0; }

        .profile-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: var(--radius-md); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); }
        .profile-avatar { width: 34px; height: 34px; border-radius: 10px; background: #1e293b; border: 1px solid rgba(16,185,129,0.4); color: #10b981; font-weight: 700; display: grid; place-items: center; flex-shrink: 0; }
        .profile-copy { display: flex; flex-direction: column; min-width: 0; flex: 1; }
        .profile-copy strong { font-size: 12.5px; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .profile-copy span { font-size: 11px; color: #94a3b8; }
        .profile-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; padding: 3px 6px; border-radius: 6px; background: rgba(16,185,129,0.16); color: #34d399; }

        /* Collapsed Sidebar */
        .sidebar-is-collapsed .sidebar { width: 80px; min-width: 80px; }
        .sidebar-is-collapsed .sidebar-wordmark,
        .sidebar-is-collapsed .sidebar-label,
        .sidebar-is-collapsed .nav-label,
        .sidebar-is-collapsed .profile-copy,
        .sidebar-is-collapsed .profile-tag,
        .sidebar-is-collapsed .nav-dot { display: none; }
        .sidebar-is-collapsed .sidebar-brand { justify-content: center; flex-direction: column; gap: 10px; }
        .sidebar-is-collapsed .nav-item,
        .sidebar-is-collapsed .system-status,
        .sidebar-is-collapsed .profile-card { justify-content: center; padding-left: 0; padding-right: 0; }

        /* Topbar */
        .topbar { display: flex; align-items: center; justify-content: space-between; height: 64px; border-bottom: 1px solid var(--border-subtle); margin-bottom: 24px; gap: 12px; }
        .topbar-left { display: flex; align-items: center; gap: 12px; }
        .topbar-logo { height: 32px; width: 32px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border-subtle); }
        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: var(--text-muted); }
        .breadcrumb span:last-child { color: var(--text-primary); font-weight: 600; }

        /* Typography & Headers */
        .eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: var(--emerald-dark); text-transform: uppercase; margin-bottom: 6px; }
        .eyebrow.light { color: #6ee7b7; }
        .page-header { margin-bottom: 22px; }
        .page-header h1 { margin: 0 0 6px; font-size: 26px; font-weight: 700; letter-spacing: -0.025em; color: var(--text-primary); }
        .page-header p { margin: 0; font-size: 14.5px; color: var(--text-secondary); }
        .overview-hero-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; }
        .header-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }

        /* Cards & Panels — STRICTLY NO HOVER TRANSFORM OR MOVEMENT */
        .panel-card, .mini-stat, .card-surface {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 20px;
          box-shadow: var(--shadow-card);
          transform: none !important;
          transition: border-color 160ms ease;
        }
        .panel-card:hover, .mini-stat:hover, .card-surface:hover {
          border-color: var(--border-strong);
          transform: none !important;
        }
        .panel-card h2, .panel-card h3 { margin: 2px 0 8px; font-size: 17px; font-weight: 700; letter-spacing: -0.015em; }
        .panel-card p { margin: 0; font-size: 13.5px; color: var(--text-secondary); line-height: 1.5; }
        .panel-heading-row, .panel-topline, .sample-header, .chart-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }

        /* Top KPI Stats Row */
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
        .mini-stat { display: flex; flex-direction: column; gap: 4px; }
        .mini-stat.accent-border { border-color: rgba(16, 185, 129, 0.45); background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%); }
        .stat-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .stat-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; color: var(--text-muted); }
        .stat-delta { font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 999px; background: #f1f5f9; color: var(--text-secondary); }
        .stat-delta.positive { background: #ecfdf5; color: #047857; }
        .mini-stat .value { font-size: 28px; font-weight: 700; letter-spacing: -0.03em; color: var(--text-primary); font-variant-numeric: tabular-nums; margin-top: 2px; }
        .mini-stat .label { font-size: 13px; color: var(--text-secondary); font-weight: 500; }

        /* Smart Widgets Grid */
        .smart-widgets-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .widget-card { display: flex; flex-direction: column; justify-content: space-between; gap: 12px; }
        .widget-sub { font-size: 13.5px; color: var(--text-secondary); margin: 0; }
        .progress-track { width: 100%; height: 8px; border-radius: 999px; background: #e2e8f0; overflow: hidden; margin: 4px 0; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #10b981, #059669); border-radius: 999px; }
        .widget-footer-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-top: 10px; border-top: 1px solid var(--border-subtle); margin-top: auto; }
        .muted-note { font-size: 12px; color: var(--text-muted); }
        .link-action { background: none; border: none; padding: 0; color: var(--emerald-dark); font-size: 12.5px; font-weight: 700; cursor: pointer; }
        .link-action:hover { text-decoration: underline; }

        .rate-pills { display: flex; flex-wrap: wrap; gap: 6px; }
        .rate-pill {
          padding: 5px 10px; border-radius: 999px; border: 1px solid var(--border-subtle);
          background: #f8fafc; font-size: 12px; font-weight: 600; color: var(--text-secondary); cursor: pointer;
        }
        .rate-pill.active { background: var(--bg-obsidian); color: #fff; border-color: var(--bg-obsidian); }
        .rate-display-box {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 12px; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid var(--border-subtle);
        }
        .rate-display-box small { display: block; font-size: 11px; color: var(--text-muted); }
        .rate-display-box strong { font-size: 18px; color: var(--text-primary); }
        .rate-points-tag { font-size: 11.5px; font-weight: 700; color: #047857; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 4px 9px; border-radius: 999px; }

        .compact-activity-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid var(--border-subtle); }
        .activity-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--emerald-core); flex-shrink: 0; }
        .activity-text { display: flex; flex-direction: column; }
        .activity-text strong { font-size: 13px; color: var(--text-primary); }
        .activity-text span { font-size: 11.5px; color: var(--text-muted); }
        .widget-action-pair { display: grid; grid-template-columns: 1.4fr 0.6fr; gap: 8px; margin-top: auto; }
        .full-btn { width: 100%; }

        /* Buttons & Badges */
        .cta-button, .secondary-button {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 10px 16px; border-radius: var(--radius-sm); font-size: 13.5px; font-weight: 600;
          cursor: pointer; border: 1px solid transparent;
        }
        .cta-button.dark { background: var(--bg-obsidian); color: #ffffff; }
        .cta-button.dark:hover { background: #152e29; border-color: var(--emerald-core); }
        .secondary-button { background: #ffffff; color: var(--text-primary); border-color: var(--border-strong); }
        .secondary-button:hover { background: #f8fafc; border-color: #94a3b8; }
        .secondary-button.small { padding: 6px 12px; font-size: 12.5px; }

        .badge-pill, .step-indicator, .status-badge {
          font-size: 11px; font-weight: 700; letter-spacing: 0.04em; padding: 4px 10px;
          border-radius: 999px; background: #f1f5f9; color: var(--text-secondary); border: 1px solid var(--border-subtle);
          white-space: nowrap;
        }
        .status-badge.success, .confidence-badge {
          background: #ecfdf5; color: #047857; border-color: #a7f3d0;
          font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px;
        }

        /* Scanner View */
        .scanner-layout { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 20px; align-items: start; }
        .panel-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .mini-icon { color: var(--emerald-core); }

        .camera-box {
          margin-top: 12px; border: 1.5px dashed #cbd5e1; border-radius: var(--radius-md);
          background: #f8fafc; padding: 28px 20px; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
        }
        .camera-box.camera-box-live { border-style: solid; border-color: var(--emerald-core); background: #0b1614; color: #f8fafc; padding: 16px; }
        .camera-box p { margin: 4px 0 0; font-weight: 600; font-size: 14.5px; }
        .camera-box-live p { color: #ffffff; }
        .camera-box small { color: var(--text-muted); font-size: 12.5px; }
        .camera-box-live small { color: #94a3b8; }

        .camera-frame { width: 132px; height: 132px; position: relative; display: grid; place-items: center; margin-bottom: 8px; }
        .frame-corner { position: absolute; width: 20px; height: 20px; border-color: var(--emerald-core); border-style: solid; }
        .top-left { top: 0; left: 0; border-width: 3px 0 0 3px; border-top-left-radius: 8px; }
        .top-right { top: 0; right: 0; border-width: 3px 3px 0 0; border-top-right-radius: 8px; }
        .bottom-left { bottom: 0; left: 0; border-width: 0 0 3px 3px; border-bottom-left-radius: 8px; }
        .bottom-right { bottom: 0; right: 0; border-width: 0 3px 3px 0; border-bottom-right-radius: 8px; }
        .camera-icon { font-size: 34px; color: var(--emerald-dark); }

        .camera-live-frame { position: relative; width: 100%; height: 280px; border-radius: 10px; overflow: hidden; background: #000; }
        .camera-video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .camera-live-indicator {
          position: absolute; top: 10px; left: 10px; display: inline-flex; align-items: center; gap: 6px;
          background: rgba(11, 22, 20, 0.88); color: #34d399;
          font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; padding: 4px 10px; border-radius: 999px;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }
        .camera-live-indicator span { width: 6px; height: 6px; border-radius: 50%; background: #10b981; }

        .scan-laser {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #10b981, transparent);
          box-shadow: 0 0 12px #10b981;
          animation: scan-sweep 2.2s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes scan-sweep { 0%, 100% { top: 8%; } 50% { top: 92%; } }

        .camera-controls { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 12px; width: 100%; }
        .camera-error { margin-top: 12px; padding: 10px 14px; border-radius: var(--radius-sm); background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; font-size: 13px; }

        /* Sample Grid & Telemetry Box */
        .sample-grid { display: grid; grid-template-columns: 1fr; gap: 8px; margin: 14px 0; }
        .sample-item {
          display: flex; align-items: center; gap: 10px; padding: 11px 14px;
          border-radius: var(--radius-md); border: 1px solid var(--border-subtle);
          background: #ffffff; font-size: 13.5px; font-weight: 600; color: var(--text-primary);
          cursor: pointer; text-align: left;
        }
        .sample-item:hover { border-color: #94a3b8; background: #f8fafc; }
        .sample-item.selected { border-color: var(--emerald-core); background: #ecfdf5; color: #065f46; }
        .tick-pill { margin-left: auto; width: 20px; height: 20px; border-radius: 50%; background: var(--emerald-core); color: #fff; font-size: 11px; display: grid; place-items: center; }

        .ai-result-box { margin-top: 14px; padding: 16px; border-radius: var(--radius-md); background: #0f172a; color: #f8fafc; border: 1px solid #1e293b; }
        .ai-result-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .ai-result-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 10px; }
        .ai-result-metrics small { display: block; font-size: 11px; color: #94a3b8; margin-bottom: 2px; }
        .ai-result-metrics strong { font-size: 15px; color: #ffffff; }
        .emerald-text { color: #34d399 !important; }
        .ai-advice { margin: 0; font-size: 12.5px !important; color: #cbd5e1 !important; line-height: 1.5; }

        /* Collections, Wallet & Impact */
        .schedule-panel { margin-bottom: 18px; }
        .empty-state { text-align: center; padding: 26px 16px; border-radius: var(--radius-md); background: #f8fafc; border: 1px dashed var(--border-strong); margin-top: 12px; }
        .empty-icon { font-size: 24px; color: var(--text-muted); margin-bottom: 8px; }
        .empty-state h3 { margin: 0 0 4px; font-size: 16px; }
        .empty-state p { margin: 0 0 14px; font-size: 13.5px; color: var(--text-secondary); }

        .history-item { display: flex; align-items: center; gap: 14px; padding: 14px; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid var(--border-subtle); margin-top: 10px; }
        .history-icon { width: 38px; height: 38px; border-radius: 10px; background: #ecfdf5; color: var(--emerald-dark); display: grid; place-items: center; font-weight: 700; flex-shrink: 0; }
        .history-copy { flex: 1; }
        .history-mainline { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; gap: 8px; }
        .pill { font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .history-date { font-size: 12px; color: var(--text-muted); }

        .wallet-summary { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 16px; margin-bottom: 20px; }
        .dark-card { background: linear-gradient(135deg, var(--bg-obsidian), #132a25); color: #fff; border: 1px solid rgba(16,185,129,0.3); }
        .wallet-topline { display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8; margin-bottom: 14px; }
        .wallet-total { font-size: 34px; font-weight: 700; letter-spacing: -0.03em; margin-bottom: 4px; }
        .soft-green { background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-color: #a7f3d0; }
        .points-label { font-size: 13px; font-weight: 600; color: #065f46; margin-top: 8px; }
        .points-value { font-size: 30px; font-weight: 700; color: #047857; }
        .points-value small { font-size: 14px; font-weight: 600; }

        .wallet-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
        .tab-button { padding: 8px 16px; border-radius: 999px; border: 1px solid var(--border-subtle); background: #fff; font-size: 13px; font-weight: 600; color: var(--text-secondary); cursor: pointer; }
        .tab-button.active { background: var(--bg-obsidian); color: #fff; border-color: var(--bg-obsidian); }

        .reward-grid, .impact-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
        .wallet-stat { display: flex; align-items: center; gap: 14px; }
        .wallet-stat-icon, .impact-icon { width: 40px; height: 40px; border-radius: 10px; background: #f1f5f9; color: var(--emerald-dark); display: grid; place-items: center; font-weight: 700; flex-shrink: 0; }
        .wallet-stat strong, .impact-stat strong { display: block; font-size: 20px; color: var(--text-primary); }
        .wallet-stat span, .impact-stat span { display: block; font-size: 13px; color: var(--text-secondary); }
        .wallet-stat small, .impact-stat small { font-size: 11.5px; color: var(--text-muted); }

        .impact-hero.dark-green { background: linear-gradient(135deg, #0b1614 0%, #064e3b 100%); color: #fff; margin-bottom: 20px; border: 1px solid rgba(16,185,129,0.35); }
        .impact-number { font-size: 44px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin: 6px 0; }
        .impact-number span { font-size: 20px; color: #34d399; margin-left: 4px; }
        .impact-hero p { color: #cbd5e1; margin: 0; }

        .info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .bar-chart { display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; height: 150px; padding-top: 20px; }
        .bar-col { flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 6px; }
        .bar-col span { width: 100%; max-width: 32px; background: linear-gradient(180deg, #10b981, #059669); border-radius: 6px 6px 2px 2px; }
        .bar-col small { font-size: 11px; color: var(--text-muted); font-weight: 600; }
        .matter-list { margin: 12px 0 0; padding-left: 18px; color: var(--text-secondary); font-size: 13.5px; line-height: 1.7; }
        .impact-disclaimer { font-size: 12px; color: var(--text-muted); }

        /* Rock-solid Modal — absolute stability */
        .modal-backdrop {
          position: fixed; inset: 0; background: rgba(11, 22, 20, 0.65);
          display: flex; align-items: center; justify-content: center;
          padding: 16px; z-index: 100;
        }
        .walkthrough-modal {
          background: #ffffff; border-radius: var(--radius-lg); max-width: 440px; width: 100%;
          padding: 24px; position: relative; box-shadow: 0 24px 48px rgba(0,0,0,0.22);
          border: 1px solid var(--border-subtle);
          transform: none !important;
          transition: none !important;
        }
        .close-button {
          position: absolute; top: 16px; right: 16px; background: #f1f5f9; border: none;
          width: 32px; height: 32px; border-radius: 50%; font-size: 18px; cursor: pointer;
          display: grid; place-items: center; color: var(--text-primary);
        }
        .close-button:hover { background: #e2e8f0; }
        .walkthrough-steps { list-style: none; padding: 0; margin: 16px 0 22px; display: flex; flex-direction: column; gap: 14px; }
        .walkthrough-steps li { display: flex; gap: 12px; align-items: flex-start; }
        .step-marker { font-size: 11px; font-weight: 800; color: #047857; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 4px 8px; border-radius: 6px; flex-shrink: 0; }
        .walkthrough-steps strong { display: block; font-size: 14px; margin-bottom: 2px; }
        .walkthrough-steps span { font-size: 13px; color: var(--text-secondary); line-height: 1.4; }
        .modal-actions { display: flex; gap: 10px; }
        .modal-actions .cta-button { flex: 1; }

        .walkthrough-progress {
          position: fixed; bottom: 20px; right: 24px; background: var(--bg-obsidian); color: #fff;
          padding: 10px 16px; border-radius: 999px; font-size: 12.5px; display: flex; align-items: center; gap: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2); border: 1px solid rgba(16,185,129,0.4); z-index: 40;
        }
        .walkthrough-progress button { background: rgba(255,255,255,0.15); border: none; color: #fff; padding: 3px 10px; border-radius: 999px; cursor: pointer; font-size: 11px; }

        /* Mobile Bottom Nav hidden on PC */
        .mobile-bottom-nav { display: none; }

        /* Tablet Breakpoint */
        @media (max-width: 1080px) {
          .smart-widgets-grid { grid-template-columns: 1fr 1fr; }
          .scanner-layout { grid-template-columns: 1fr; }
        }

        /* Dedicated Mobile Layout (< 768px) */
        @media (max-width: 767px) {
          .sidebar { display: none; }
          .hero-cta-desktop { display: none; }
          .main-panel {
            padding: 0 16px calc(88px + env(safe-area-inset-bottom));
          }
          .topbar {
            height: 56px;
            margin-bottom: 16px;
            position: sticky;
            top: 0;
            background: rgba(243, 246, 248, 0.92);
            backdrop-filter: blur(8px);
            z-index: 20;
          }
          .page-header h1 { font-size: 22px; }
          .page-header p { font-size: 13.5px; }
          .stats-row { grid-template-columns: 1fr; gap: 12px; }
          .smart-widgets-grid { grid-template-columns: 1fr; gap: 14px; }
          .wallet-summary, .reward-grid, .impact-stats-grid, .info-row { grid-template-columns: 1fr; gap: 12px; }
          .camera-live-frame { height: 220px; }
          .camera-controls { display: grid; grid-template-columns: 1fr 1fr; }
          .camera-controls button:last-child:nth-child(odd) { grid-column: span 2; }
          .walkthrough-progress { bottom: calc(74px + env(safe-area-inset-bottom)); right: 16px; left: 16px; justify-content: space-between; }

          .mobile-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            background: var(--bg-obsidian);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding: 6px 4px calc(8px + env(safe-area-inset-bottom));
            z-index: 60;
          }
          .mobile-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            background: transparent;
            border: none;
            color: #94a3b8;
            padding: 6px 2px;
            cursor: pointer;
            font-size: 10.5px;
            font-weight: 600;
          }
          .mobile-nav-icon { font-size: 17px; line-height: 1; }
          .mobile-nav-item.active { color: #10b981; }
        }
      `}</style>

      <Sidebar
        active={activeView}
        setActive={setActiveView}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((value) => !value)}
        sidebarRef={sidebarRef}
      />

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            <img
              src={logo}
              alt="EcoSync"
              className="topbar-logo"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="breadcrumb">
              <span>EcoSync</span>
              <span>/</span>
              <span>{pageTitle}</span>
            </div>
          </div>
          <div className="topbar-actions">
            <button type="button" className="secondary-button small" onClick={() => setShowWalkthrough(true)}>
              Quick guide
            </button>
          </div>
        </header>

        <div key={activeView}>{renderedView}</div>

        {showWalkthrough && (
          <WalkthroughModal onClose={() => setShowWalkthrough(false)} onBegin={beginWalkthrough} />
        )}

        {walkthroughStep > 0 && (
          <div className="walkthrough-progress" role="status">
            <span>Demo tour · Step {walkthroughStep} of 3</span>
            <button type="button" onClick={() => setWalkthroughStep(0)}>
              Dismiss
            </button>
          </div>
        )}
      </main>

      <MobileBottomNav active={activeView} setActive={setActiveView} />
    </div>
  );
}
