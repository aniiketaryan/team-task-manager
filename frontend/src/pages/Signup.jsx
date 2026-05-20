import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/signup', form);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-left-logo">
          <div className="auth-left-logo-icon">❋</div>
          Nexus
        </div>
        <div className="auth-left-content">
          <h2>Your team's<br/>new home.</h2>
          <p>Set up your workspace in seconds. Invite your team and start shipping faster.</p>
        </div>
        <div className="auth-left-features">
          {['Free to get started','No credit card required','Unlimited projects','Real-time collaboration'].map(f => (
            <div key={f} className="auth-feature">
              <div className="auth-feature-dot"></div>
              {f}
            </div>
          ))}
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <h1>Create account</h1>
          <p>Start your workspace today</p>
          {error && <div style={{background:'rgba(192,57,43,0.08)',border:'1px solid rgba(192,57,43,0.2)',color:'var(--red)',padding:'0.75rem 1rem',borderRadius:'8px',fontSize:'0.875rem',marginBottom:'1rem'}}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Your name" value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@company.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{marginTop:'0.5rem'}}>
              {loading ? 'Creating...' : 'Get Started Free →'}
            </button>
          </form>
          <div className="auth-link">
            Have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}