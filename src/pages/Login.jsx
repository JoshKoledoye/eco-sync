import { Link } from 'react-router-dom';

export default function Login() {
  function handleSubmit(event) {
    event.preventDefault();
    alert('Login is a UI scaffold for now. Authentication can be connected next.');
  }

  return (
    <main className="login-page">
      <div className="login-decoration decoration-one" /><div className="login-decoration decoration-two" />
      <Link to="/" className="brand login-brand"><span className="brand-mark">e</span> ecosync</Link>
      <section className="login-card">
        <div className="login-leaf">✳</div><div className="eyebrow">WELCOME BACK</div><h1>Good to see you.</h1><p className="login-subtitle">Sign in to keep making a difference.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label><input id="email" type="email" placeholder="you@example.com" autoComplete="email" required />
          <div className="password-label"><label htmlFor="password">Password</label><a href="#forgot">Forgot password?</a></div><input id="password" type="password" placeholder="Enter your password" autoComplete="current-password" required />
          <button className="primary-button login-submit" type="submit">Sign in <span>→</span></button>
        </form>
        <p className="signup-note">New to EcoSync? <a href="#signup">Create an account</a></p>
        <div className="login-back"><Link to="/">← Back to dashboard</Link></div>
      </section>
      <p className="login-footer">A cleaner future starts with all of us. <span>✳</span></p>
    </main>
  );
}
