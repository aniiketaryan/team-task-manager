import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/projects').then(res => setProjects(res.data)).catch(() => {});
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/projects', form);
      setProjects([res.data, ...projects]);
      setShowModal(false);
      setForm({ name: '', description: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || '?';

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-brand-icon">❋</div>
          Nexus
        </div>
        <div className="navbar-user">
          <div className="navbar-avatar">{initials(user?.name)}</div>
          <span className="navbar-name">{user?.name}</span>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <div className="projects-hero">
        <div className="projects-hero-content">
          <h2>Good to see you, {user?.name?.split(' ')[0]} 👋</h2>
          <p>You have {projects.length} project{projects.length !== 1 ? 's' : ''} in your workspace</p>
          <div className="projects-hero-actions">
            <button className="btn-white" onClick={() => setShowModal(true)}>+ New Project</button>
          </div>
        </div>
      </div>

      <div className="container">
        {projects.length === 0 ? (
          <div className="empty-state" style={{marginTop:'2rem'}}>
            <div className="empty-state-icon">◈</div>
            <h3>No projects yet</h3>
            <p style={{marginBottom:'1.5rem'}}>Create your first project to get your team moving</p>
            <button className="btn btn-primary" style={{width:'auto',margin:'0 auto'}} onClick={() => setShowModal(true)}>+ Create Project</button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(p => (
              <div key={p.id} className="project-card" onClick={() => navigate(`/projects/${p.id}`)}>
                <div className="project-card-icon">{p.name[0].toUpperCase()}</div>
                <h3>{p.name}</h3>
                <p>{p.description || 'No description provided'}</p>
                <div className="project-card-footer">
                  <span className={`badge badge-${p.role}`}>{p.role}</span>
                  <div className="project-card-arrow">→</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Project</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={createProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input type="text" placeholder="e.g. Product Launch Q3" value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" placeholder="Brief description of this project" value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{width:'auto'}} disabled={loading}>
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}