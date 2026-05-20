import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [tab, setTab] = useState('tasks');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', due_date: '', priority: 'medium', assigned_to: '' });
  const [memberEmail, setMemberEmail] = useState('');

  useEffect(() => { loadAll(); }, [id]);

  const loadAll = async () => {
    try {
      const [pRes, tRes, dRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`),
        api.get(`/dashboard/${id}`)
      ]);
      setProject(pRes.data);
      setTasks(Array.isArray(tRes.data) ? tRes.data : []);
      setDashboard(dRes.data || null);
      setIsAdmin(pRes.data.role === 'admin');
    } catch {
      navigate('/');
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTask) {
        await api.put(`/tasks/${editTask.id}`, { ...taskForm, project_id: id });
      } else {
        await api.post('/tasks', { ...taskForm, project_id: id });
      }
      setShowTaskModal(false);
      setEditTask(null);
      setTaskForm({ title: '', description: '', due_date: '', priority: 'medium', assigned_to: '' });
      loadAll();
    } catch (err) { alert(err.response?.data?.message || 'Failed to save task'); }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      loadAll();
    } catch (err) { alert(err.response?.data?.message); }
  };

  const deleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try { await api.delete(`/tasks/${taskId}`); loadAll(); }
    catch (err) { alert(err.response?.data?.message); }
  };

  const addMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail });
      setMemberEmail(''); setShowMemberModal(false); loadAll();
    } catch (err) { alert(err.response?.data?.message); }
  };

  const removeMember = async (userId) => {
    if (!confirm('Remove this member?')) return;
    try { await api.delete(`/projects/${id}/members/${userId}`); loadAll(); }
    catch (err) { alert(err.response?.data?.message); }
  };

  const openEditTask = (task) => {
    setEditTask(task);
    setTaskForm({ title: task.title, description: task.description || '', due_date: task.due_date || '', priority: task.priority, assigned_to: task.assigned_to || '' });
    setShowTaskModal(true);
  };

  const tasksByStatus = (status) => tasks.filter(t => t.status === status);
  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || '?';

  if (!project) return <div className="loading">Loading project</div>;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-brand-icon">✦</div>
          TaskFlow
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>← Back</button>
      </nav>

      <div className="project-detail-header">
        <div>
          <h2>{project.name}</h2>
          <p>{project.description || 'No description'}</p>
        </div>
        <div className="header-actions">
          {isAdmin && (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowMemberModal(true)}>+ Member</button>
              <button className="btn btn-primary btn-sm" style={{width:'auto'}} onClick={() => { setEditTask(null); setTaskForm({ title:'', description:'', due_date:'', priority:'medium', assigned_to:'' }); setShowTaskModal(true); }}>+ New Task</button>
            </>
          )}
        </div>
      </div>

      <div className="container">
        <div className="tabs">
          {['tasks','dashboard','members'].map(t => (
            <button key={t} className={`tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* TASKS */}
        {tab === 'tasks' && (
          <div className="kanban">
            {[['todo','To Do','#9090a8'],['inprogress','In Progress','#fbbf24'],['done','Done','#34d399']].map(([status, label, color]) => (
              <div key={status} className="kanban-col">
                <div className="kanban-col-header">
                  <h4 style={{color}}>{label}</h4>
                  <span className="kanban-count">{tasksByStatus(status).length}</span>
                </div>
                {tasksByStatus(status).map(task => (
                  <div key={task.id} className="task-card">
                    <h5>{task.title}</h5>
                    {task.description && <p>{task.description}</p>}
                    <div className="task-meta">
                      <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                      {task.due_date && <span className="due-date">📅 {task.due_date}</span>}
                    </div>
                    {task.assigned_to_name && <div className="task-assigned">👤 {task.assigned_to_name}</div>}
                    <div className="task-actions">
                      <select className="status-select" value={task.status} onChange={e => updateStatus(task.id, e.target.value)}>
                        <option value="todo">To Do</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      {isAdmin && (
                        <>
                          <button className="btn btn-ghost btn-sm" onClick={() => openEditTask(task)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {tasksByStatus(status).length === 0 && <div className="no-tasks">No tasks here</div>}
              </div>
            ))}
          </div>
        )}

        {/* DASHBOARD */}
        {tab === 'dashboard' && dashboard && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>{dashboard.total}</h3>
                <p>Total Tasks</p>
              </div>
              {[{status:'todo',label:'To Do'},{status:'inprogress',label:'In Progress'},{status:'done',label:'Done'}].map(({status,label}) => (
                <div key={status} className="stat-card">
                  <h3>{dashboard.byStatus.find(s=>s.status===status)?.count || 0}</h3>
                  <p>{label}</p>
                </div>
              ))}
              <div className="stat-card">
                <h3 style={{color:'var(--red)'}}>{dashboard.overdue.length}</h3>
                <p>Overdue</p>
              </div>
            </div>

            {dashboard.byUser.length > 0 && (
              <div className="section-card">
                <h4>Tasks per Member</h4>
                {dashboard.byUser.map(u => (
                  <div key={u.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.6rem 0',borderBottom:'1px solid var(--border)'}}>
                    <span style={{color:'var(--text)',fontSize:'0.875rem'}}>{u.name}</span>
                    <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                      <div style={{width:'120px',height:'6px',background:'var(--bg3)',borderRadius:'3px',overflow:'hidden'}}>
                        <div style={{width:`${Math.min(100,(u.count/dashboard.total)*100)}%`,height:'100%',background:'var(--accent)',borderRadius:'3px'}}></div>
                      </div>
                      <span style={{color:'var(--text2)',fontSize:'0.8rem',width:'20px',textAlign:'right'}}>{u.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {dashboard.overdue.length > 0 && (
              <div className="overdue-card">
                <h4>⚠ Overdue Tasks</h4>
                {dashboard.overdue.map(t => (
                  <div key={t.id} className="overdue-item">
                    <strong>{t.title}</strong>
                    <span>Due: {t.due_date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MEMBERS */}
        {tab === 'members' && (
          <div className="section-card">
            <h4>Team Members ({project.members?.length || 0})</h4>
            <div className="members-list">
              {project.members?.map(m => (
                <div key={m.id} className="member-item">
                  <div className="member-info">
                    <div className="member-avatar">{initials(m.name)}</div>
                    <div>
                      <div className="member-name">{m.name}</div>
                      <div className="member-email">{m.email}</div>
                    </div>
                  </div>
                  <div className="member-actions">
                    <span className={`badge badge-${m.role}`}>{m.role}</span>
                    {isAdmin && m.id !== user.id && (
                      <button className="btn btn-danger btn-sm" onClick={() => removeMember(m.id)}>Remove</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TASK MODAL */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editTask ? 'Edit Task' : 'New Task'}</h3>
              <button className="modal-close" onClick={() => setShowTaskModal(false)}>✕</button>
            </div>
            <form onSubmit={handleTaskSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" placeholder="Task title" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" placeholder="Optional description" value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" value={taskForm.due_date} onChange={e => setTaskForm({...taskForm, due_date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select value={taskForm.assigned_to} onChange={e => setTaskForm({...taskForm, assigned_to: e.target.value})}>
                  <option value="">Unassigned</option>
                  {project.members?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{width:'auto'}}>{editTask ? 'Update' : 'Create Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEMBER MODAL */}
      {showMemberModal && (
        <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Member</h3>
              <button className="modal-close" onClick={() => setShowMemberModal(false)}>✕</button>
            </div>
            <form onSubmit={addMember}>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="member@example.com" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{width:'auto'}}>Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}