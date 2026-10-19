import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import StatusMessage from '../components/StatusMessage.jsx';
import './projects-management.css';

const PROJECT_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'closed', label: 'Closed' },
];

function formatStatus(status) {
  return (
    PROJECT_STATUSES.find((item) => item.value === status)?.label ||
    status ||
    'New'
  );
}

export default function ProjectsManagement() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [status, setStatus] = useState('new');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');

  const loadProjects = useCallback(async () => {
    if (!supabase) {
      setMessage('Supabase is not configured. Check your environment variables.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, customer_name, status')
        .order('id', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error) {
      console.error('Load projects error:', error);
      setMessage(error.message || 'Could not load projects.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function addProject(event) {
    event.preventDefault();

    if (!supabase) {
      setMessage('Supabase is not configured.');
      setMessageType('error');
      return;
    }

    if (!name.trim() || !customerName.trim()) {
      setMessage('Please enter both the project name and customer name.');
      setMessageType('error');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: name.trim(),
          customer_name: customerName.trim(),
          status,
        })
        .select('id, name, customer_name, status')
        .single();

      if (error) throw error;

      setProjects((current) => [data, ...current]);
      setName('');
      setCustomerName('');
      setStatus('new');

      setMessage('Project added successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Add project error:', error);
      setMessage(error.message || 'Could not add the project.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  }

  async function updateProjectStatus(project, newStatus) {
    if (!supabase || project.status === newStatus) return;

    const previousProjects = projects;

    setProjects((current) =>
      current.map((item) =>
        item.id === project.id
          ? { ...item, status: newStatus }
          : item
      )
    );

    setMessage('');

    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', project.id);

      if (error) throw error;

      setMessage('Project status updated successfully.');
      setMessageType('success');
    } catch (error) {
      console.error('Update project status error:', error);
      setProjects(previousProjects);
      setMessage(error.message || 'Could not update project status.');
      setMessageType('error');
    }
  }

  async function deleteProject(project) {
    if (!supabase) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`
    );

    if (!confirmed) return;

    const previousProjects = projects;

    setProjects((current) =>
      current.filter((item) => item.id !== project.id)
    );

    setMessage('');

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (error) throw error;

      setMessage('Project deleted successfully.');
      setMessageType('success');
    } catch (error) {
      console.error('Delete project error:', error);
      setProjects(previousProjects);
      setMessage(error.message || 'Could not delete the project.');
      setMessageType('error');
    }
  }

  const filteredProjects = projects.filter((project) => {
    const term = search.trim().toLowerCase();

    return (
      !term ||
      String(project.name || '').toLowerCase().includes(term) ||
      String(project.customer_name || '').toLowerCase().includes(term) ||
      String(formatStatus(project.status)).toLowerCase().includes(term)
    );
  });

  return (
    <section className="projects-management">
      <div className="projects-heading">
        <div>
          <span className="projects-eyebrow">PROJECT WORKSPACE</span>
          <h2>Projects Management</h2>
          <p>Organise projects and keep track of their progress.</p>
        </div>

        <button
          type="button"
          className="projects-refresh-button"
          onClick={loadProjects}
          disabled={loading}
        >
          {loading ? 'Loading…' : '↻ Refresh'}
        </button>
      </div>

      {message && (
        <StatusMessage type={messageType}>
          {message}
        </StatusMessage>
      )}

      <form className="project-form" onSubmit={addProject}>
        <h3>Add a New Project</h3>

        <div className="project-form-grid">
          <label>
            Project Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter project name"
              maxLength={150}
              required
            />
          </label>

          <label>
            Customer Name
            <input
              type="text"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Enter customer name"
              maxLength={150}
              required
            />
          </label>

          <label>
            Initial Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {PROJECT_STATUSES.map((item) => (
                <option value={item.value} key={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" disabled={saving}>
            {saving ? 'Saving Project…' : '+ Add Project'}
          </button>
        </div>
      </form>

      <div className="projects-list-panel">
        <div className="projects-list-heading">
          <div>
            <h3>All Projects</h3>
            <p>
              {projects.length}{' '}
              {projects.length === 1 ? 'project' : 'projects'} saved
            </p>
          </div>

          <input
            type="search"
            className="projects-search"
            placeholder="Search projects..."
            aria-label="Search projects"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <p className="projects-empty">Loading projects…</p>
        ) : filteredProjects.length === 0 ? (
          <div className="projects-empty">
            <span aria-hidden="true">▤</span>
            <h3>
              {projects.length
                ? 'No Matching Projects'
                : 'No Projects Yet'}
            </h3>
            <p>
              {projects.length
                ? 'Try another search term.'
                : 'Add your first project using the form above.'}
            </p>
          </div>
        ) : (
          <div className="projects-table-scroll">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <strong>{project.name}</strong>
                      <small>Project #{project.id}</small>
                    </td>

                    <td>{project.customer_name || '—'}</td>

                    <td>
                      <span
                        className={`project-status status-${String(
                          project.status || 'new'
                        ).replace(/[^a-zA-Z0-9_-]/g, '')}`}
                      >
                        {formatStatus(project.status)}
                      </span>
                    </td>

                    <td>
                      <div className="project-row-actions">
                        <select
                          aria-label={`Change status for ${project.name}`}
                          value={project.status || 'new'}
                          onChange={(event) =>
                            updateProjectStatus(
                              project,
                              event.target.value
                            )
                          }
                        >
                          {PROJECT_STATUSES.map((item) => (
                            <option value={item.value} key={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          className="project-delete-button"
                          onClick={() => deleteProject(project)}
                          aria-label={`Delete ${project.name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
