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
      alert(err.response?.data?.message || 'Failed to create project');
    } finally { setLoading(false); }
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || '?';

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-brand-icon">✦</div>
          TaskFlow
        </div>
        <div className="navbar-user">
          <span style={{color:'var(--text2)', fontSize:'0.875rem'}}>Hello, {user?.name}</span>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <div className="container">
        <div className="page-header">
          <div className="page-header-left">
            <h2>My Projects</h2>
            <p>{projects.length} project{projects.length !== 1 ? 's' : ''} in your workspace</p>
          </div>
          <button className="btn btn-primary" style={{width:'auto'}} onClick={() => setShowModal(true)}>
            + New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◈</div>
            <h3>No projects yet</h3>
            <p>Create your first project to get started</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(p => (
              <div key={p.id} className="project-card" onClick={() => navigate(`/projects/${p.id}`)}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem'}}>
                  <div style={{width:'40px',height:'40px',background:'var(--accent)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',fontFamily:'Syne',fontWeight:'800',color:'white'}}>
                    {p.name[0].toUpperCase()}
                  </div>
                  <span className={`badge badge-${p.role}`}>{p.role}</span>
                </div>
                <h3>{p.name}</h3>
                <p>{p.description || 'No description provided'}</p>
                <div className="project-card-footer">
                  <span style={{fontSize:'0.75rem',color:'var(--text3)'}}>Click to open →</span>
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
                <input type="text" placeholder="e.g. Website Redesign" value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" placeholder="What is this project about?" value={form.description}
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