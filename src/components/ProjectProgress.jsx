
import { useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import "./ProjectProgress.css";

const EMPTY_PROJECT = {
  name: "",
  client_name: "",
  location: "",
  description: "",
  status: "Planning",
  progress: 0,
  start_date: "",
  expected_handover_date: "",
  latest_update: "",
};

const STATUS_OPTIONS = [
  "Planning",
  "In Progress",
  "On Hold",
  "Completed",
];

const statusToDatabase = {
  Planning: "planning",
  "In Progress": "in_progress",
  "On Hold": "on_hold",
  Completed: "completed",
  new: "new",
  contacted: "contacted",
  in_progress: "in_progress",
  completed: "completed",
  closed: "closed",
};

const statusFromDatabase = {
  planning: "Planning",
  in_progress: "In Progress",
  on_hold: "On Hold",
  completed: "Completed",
  new: "Planning",
  contacted: "Planning",
  closed: "Completed",
};

const MILESTONE_OPTIONS = [
  "Site inspection",
  "Planning and design",
  "Materials and procurement",
  "Work in progress",
  "Quality inspection",
  "Final handover",
];

function formatDate(value) {
  if (!value) return "Not scheduled";

  const date = new Date(`${value}`.slice(0, 10) + "T00:00:00");

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalizeProject(project) {
  const rawStatus = project.status ?? "planning";

  return {
    ...project,
    name: project.name ?? project.project_name ?? "Untitled project",
    client_name: project.client_name ?? project.customer_name ?? "",
    location: project.location ?? "",
    description: project.description ?? "",
    status: statusFromDatabase[rawStatus] ?? rawStatus,
    progress: Math.min(
      100,
      Math.max(0, Number(project.progress ?? project.progress_percentage ?? 0))
    ),
    start_date: project.start_date ?? "",
    expected_handover_date:
      project.expected_handover_date ?? project.handover_date ?? "",
    latest_update: project.latest_update ?? "",
    milestones: Array.isArray(project.milestones) ? project.milestones : [],
  };
}

function getStatusClass(status) {
  return String(status || "Planning")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getDatabaseStatus(status) {
  return statusToDatabase[status] ?? status;
}

export default function ProjectProgress() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(EMPTY_PROJECT);
  const [milestones, setMilestones] = useState([]);
  const [newMilestone, setNewMilestone] = useState("");

  async function loadProjects() {
    setLoading(true);
    setError("");

    if (!isSupabaseConfigured || !supabase) {
      setError(
        "Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY."
      );
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const normalized = (data ?? []).map(normalizeProject);

      setProjects(normalized);

      setSelectedProject((current) =>
        current
          ? normalized.find((project) => project.id === current.id) ?? null
          : null
      );
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load projects. Check your database table and access policies."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return projects;

    return projects.filter((project) =>
      [
        project.name,
        project.client_name,
        project.location,
        project.status,
      ].some((value) => String(value ?? "").toLowerCase().includes(term))
    );
  }, [projects, search]);

  function openNewProject() {
    setEditingId(null);
    setForm({ ...EMPTY_PROJECT });
    setMilestones([]);
    setNewMilestone("");
    setSelectedProject(null);
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function openEditProject(project) {
    setEditingId(project.id);
    setForm({
      ...EMPTY_PROJECT,
      ...project,
      status: statusFromDatabase[project.status] ?? project.status,
      progress: Number(project.progress || 0),
    });
    setMilestones(
      Array.isArray(project.milestones) ? project.milestones : []
    );
    setNewMilestone("");
    setSelectedProject(null);
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === "progress" ? Number(value) : value,
    }));
  }

  function addMilestone() {
    const title = newMilestone.trim();
    if (!title) return;

    setMilestones((current) => [
      ...current,
      { title, completed: false },
    ]);
    setNewMilestone("");
  }

  function toggleMilestone(index) {
    setMilestones((current) =>
      current.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      )
    );
  }

  function removeMilestone(index) {
    setMilestones((current) => current.filter((_, i) => i !== index));
  }

  async function saveProject(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!form.name.trim()) {
      setError("Please enter a project name.");
      return;
    }

    if (form.progress < 0 || form.progress > 100) {
      setError("Progress must be between 0 and 100.");
      return;
    }

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        client_name: form.client_name.trim() || null,
        location: form.location.trim() || null,
        description: form.description.trim() || null,
        status: getDatabaseStatus(form.status),
        progress: Number(form.progress),
        start_date: form.start_date || null,
        expected_handover_date: form.expected_handover_date || null,
        latest_update: form.latest_update.trim() || null,
        milestones,
      };

      let result;

      if (editingId) {
        result = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editingId)
          .select()
          .single();
      } else {
        result = await supabase
          .from("projects")
          .insert(payload)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      const savedProject = normalizeProject(result.data);

      setProjects((current) => {
        const exists = current.some(
          (project) => project.id === savedProject.id
        );

        return exists
          ? current.map((project) =>
              project.id === savedProject.id ? savedProject : project
            )
          : [savedProject, ...current];
      });

      setShowForm(false);
      setSelectedProject(savedProject);
      setNotice(
        editingId
          ? "Project updated successfully."
          : "Project created successfully."
      );
    } catch (err) {
      setError(
        err?.message ||
          "Unable to save the project. Check your table columns and permissions."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(project) {
    const confirmed = window.confirm(
      `Delete "${project.name}"? This cannot be undone.`
    );

    if (!confirmed || !supabase) return;

    setError("");
    setNotice("");

    try {
      const { error: deleteError } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      if (deleteError) throw deleteError;

      setProjects((current) =>
        current.filter((item) => item.id !== project.id)
      );
      setSelectedProject(null);
      setNotice("Project deleted.");
    } catch (err) {
      setError(err?.message || "Unable to delete the project.");
    }
  }

  async function saveProgress(project, progress, status) {
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    const safeProgress = Math.min(
      100,
      Math.max(0, Number(progress))
    );

    setError("");
    setNotice("");

    try {
      const payload = {
        progress: safeProgress,
        status: getDatabaseStatus(status || project.status),
      };

      const { data, error: updateError } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", project.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const updated = normalizeProject(data);

      setProjects((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item
        )
      );

      setSelectedProject(updated);
      setNotice("Progress updated successfully.");
    } catch (err) {
      setError(err?.message || "Unable to update project progress.");
    }
  }

  async function saveUpdate(project, updateText) {
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    const text = updateText.trim();

    if (!text) {
      setError("Enter a project update before saving.");
      return;
    }

    setError("");
    setNotice("");

    try {
      const { data, error: updateError } = await supabase
        .from("projects")
        .update({ latest_update: text })
        .eq("id", project.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const updated = normalizeProject(data);

      setProjects((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item
        )
      );

      setSelectedProject(updated);
      setNotice("Project update saved.");
    } catch (err) {
      setError(err?.message || "Unable to save the project update.");
    }
  }

  if (loading) {
    return (
      <section className="pp-shell">
        <div className="pp-loading">
          <span className="pp-spinner" />
          <p>Loading project information…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="pp-shell">
      <header className="pp-header">
        <div>
          <span className="pp-eyebrow">RIGVEDA ENTERPRISES</span>
          <h1>Project management</h1>
          <p>
            Track execution, record site updates, and keep handover dates
            visible in one place.
          </p>
        </div>

        <button
          className="pp-button pp-button-primary"
          onClick={openNewProject}
        >
          <span aria-hidden="true">＋</span> New project
        </button>
      </header>

      {error && (
        <div className="pp-message pp-message-error" role="alert">
          <strong>Something needs attention</strong>
          <p>{error}</p>
        </div>
      )}

      {notice && (
        <div className="pp-message pp-message-success" role="status">
          {notice}
          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <div className="pp-stats">
        <article className="pp-stat">
          <span>Total projects</span>
          <strong>{projects.length}</strong>
        </article>
        <article className="pp-stat">
          <span>In progress</span>
          <strong>
            {projects.filter((p) => p.status === "In Progress").length}
          </strong>
        </article>
        <article className="pp-stat">
          <span>On hold</span>
          <strong>
            {projects.filter((p) => p.status === "On Hold").length}
          </strong>
        </article>
        <article className="pp-stat">
          <span>Completed</span>
          <strong>
            {
              projects.filter(
                (p) => p.status === "Completed" || p.progress === 100
              ).length
            }
          </strong>
        </article>
      </div>

      {showForm ? (
        <form className="pp-form" onSubmit={saveProject}>
          <div className="pp-form-heading">
            <div>
              <span className="pp-eyebrow">
                {editingId ? "EDIT PROJECT" : "PROJECT SETUP"}
              </span>
              <h2>
                {editingId ? "Update project details" : "Create a project"}
              </h2>
            </div>

            <button
              className="pp-button pp-button-light"
              type="button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>

          <div className="pp-form-grid">
            <label>
              Project name *
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. HVAC installation"
                required
              />
            </label>

            <label>
              Client name
              <input
                name="client_name"
                value={form.client_name}
                onChange={updateField}
                placeholder="Client or company"
              />
            </label>

            <label>
              Project location
              <input
                name="location"
                value={form.location}
                onChange={updateField}
                placeholder="Site location"
              />
            </label>

            <label>
              Project status
              <select
                name="status"
                value={form.status}
                onChange={updateField}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Start date
              <input
                type="date"
                name="start_date"
                value={form.start_date || ""}
                onChange={updateField}
              />
            </label>

            <label>
              Expected handover date
              <input
                type="date"
                name="expected_handover_date"
                value={form.expected_handover_date || ""}
                onChange={updateField}
              />
            </label>

            <label className="pp-full-width">
              Project description
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows="3"
                placeholder="Scope of work, services, or project notes"
              />
            </label>

            <label className="pp-full-width">
              Progress — {form.progress}%
              <input
                type="range"
                name="progress"
                min="0"
                max="100"
                step="5"
                value={form.progress}
                onChange={updateField}
              />
            </label>

            <label className="pp-full-width">
              Latest project update
              <textarea
                name="latest_update"
                value={form.latest_update}
                onChange={updateField}
                rows="3"
                placeholder="Write a clear update for the customer"
              />
            </label>
          </div>

          <div className="pp-milestone-editor">
            <h3>Project milestones</h3>
            <p>Add important stages for this project.</p>

            <div className="pp-add-milestone">
              <input
                value={newMilestone}
                onChange={(event) => setNewMilestone(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addMilestone();
                  }
                }}
                placeholder="Enter a milestone"
              />
              <button
                type="button"
                className="pp-button pp-button-light"
                onClick={addMilestone}
              >
                Add milestone
              </button>
            </div>

            {milestones.length === 0 ? (
              <p className="pp-muted">No milestones added yet.</p>
            ) : (
              <ul className="pp-milestone-list">
                {milestones.map((milestone, index) => (
                  <li key={`${milestone.title}-${index}`}>
                    <label className="pp-check-label">
                      <input
                        type="checkbox"
                        checked={Boolean(milestone.completed)}
                        onChange={() => toggleMilestone(index)}
                      />
                      <span>{milestone.title}</span>
                    </label>
                    <button
                      type="button"
                      className="pp-icon-button"
                      onClick={() => removeMilestone(index)}
                      aria-label={`Remove ${milestone.title}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="pp-suggested-milestones">
              {MILESTONE_OPTIONS.filter(
                (item) => !milestones.some((m) => m.title === item)
              )
                .slice(0, 4)
                .map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() =>
                      setMilestones((current) => [
                        ...current,
                        { title: item, completed: false },
                      ])
                    }
                  >
                    + {item}
                  </button>
                ))}
            </div>
          </div>

          <div className="pp-form-actions">
            <button
              type="button"
              className="pp-button pp-button-light"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pp-button pp-button-primary"
              disabled={saving}
            >
              {saving
                ? "Saving…"
                : editingId
                  ? "Save changes"
                  : "Create project"}
            </button>
          </div>
        </form>
      ) : selectedProject ? (
        <ProjectDetails
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
          onEdit={() => openEditProject(selectedProject)}
          onDelete={() => deleteProject(selectedProject)}
          onSaveProgress={(progress, status) =>
            saveProgress(selectedProject, progress, status)
          }
          onSaveUpdate={(text) => saveUpdate(selectedProject, text)}
        />
      ) : (
        <>
          <div className="pp-list-toolbar">
            <div>
              <h2>Your projects</h2>
              <p>Select a project to view details and update progress.</p>
            </div>
            <input
              className="pp-search"
              type="search"
              placeholder="Search projects…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {filteredProjects.length === 0 ? (
            <div className="pp-empty">
              <span className="pp-empty-icon" aria-hidden="true">◇</span>
              <h3>{search ? "No matching projects" : "No projects yet"}</h3>
              <p>
                {search
                  ? "Try a different search term."
                  : "Create your first project to start tracking progress, milestones, and handover dates."}
              </p>
              {!search && (
                <button
                  className="pp-button pp-button-primary"
                  onClick={openNewProject}
                >
                  Create first project
                </button>
              )}
            </div>
          ) : (
            <div className="pp-project-grid">
              {filteredProjects.map((project) => (
                <button
                  type="button"
                  className="pp-project-card"
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project);
                    setNotice("");
                    setError("");
                  }}
                >
                  <div className="pp-card-top">
                    <span className="pp-project-symbol" aria-hidden="true">
                      R
                    </span>
                    <span
                      className={`pp-status pp-status-${getStatusClass(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <h3>{project.name}</h3>
                  <p className="pp-card-client">
                    {project.client_name || "Client not specified"}
                  </p>

                  {project.location && (
                    <p className="pp-card-location">
                      <span aria-hidden="true">⌖</span> {project.location}
                    </p>
                  )}

                  <div className="pp-progress-heading">
                    <span>Project progress</span>
                    <strong>{project.progress}%</strong>
                  </div>

                  <div
                    className="pp-progress-track"
                    role="progressbar"
                    aria-valuenow={project.progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label={`${project.name} progress`}
                  >
                    <span style={{ width: `${project.progress}%` }} />
                  </div>

                  <div className="pp-card-footer">
                    <span>
                      Handover
                      <strong>
                        {formatDate(project.expected_handover_date)}
                      </strong>
                    </span>
                    <span className="pp-card-open">View details ↗</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function ProjectDetails({
  project,
  onBack,
  onEdit,
  onDelete,
  onSaveProgress,
  onSaveUpdate,
}) {
  const [progress, setProgress] = useState(project.progress);
  const [status, setStatus] = useState(project.status);
  const [updateText, setUpdateText] = useState(project.latest_update || "");
  const [savingProgress, setSavingProgress] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);

  useEffect(() => {
    setProgress(project.progress);
    setStatus(project.status);
    setUpdateText(project.latest_update || "");
  }, [
    project.id,
    project.progress,
    project.status,
    project.latest_update,
  ]);

  const milestones = Array.isArray(project.milestones)
    ? project.milestones
    : [];

  async function handleSaveProgress() {
    setSavingProgress(true);
    try {
      await onSaveProgress(progress, status);
    } finally {
      setSavingProgress(false);
    }
  }

  async function handleSaveUpdate() {
    setSavingUpdate(true);
    try {
      await onSaveUpdate(updateText);
    } finally {
      setSavingUpdate(false);
    }
  }

  return (
    <article className="pp-detail">
      <button className="pp-back-button" onClick={onBack}>
        ← Back to all projects
      </button>

      <div className="pp-detail-header">
        <div>
          <span className="pp-eyebrow">PROJECT OVERVIEW</span>
          <h2>{project.name}</h2>
          <p>
            {project.client_name || "Client not specified"}
            {project.location ? ` · ${project.location}` : ""}
          </p>
        </div>
        <div className="pp-detail-actions">
          <button className="pp-button pp-button-light" onClick={onEdit}>
            Edit project
          </button>
          <button className="pp-button pp-button-danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className="pp-detail-progress">
        <div className="pp-detail-progress-top">
          <div>
            <span className="pp-muted">Overall completion</span>
            <strong className="pp-big-number">{project.progress}%</strong>
          </div>
          <span
            className={`pp-status pp-status-${getStatusClass(project.status)}`}
          >
            {project.status}
          </span>
        </div>

        <div className="pp-progress-track pp-progress-track-large">
          <span style={{ width: `${project.progress}%` }} />
        </div>

        {project.description && <p>{project.description}</p>}
      </div>

      <div className="pp-detail-facts">
        <div>
          <span>Start date</span>
          <strong>{formatDate(project.start_date)}</strong>
        </div>
        <div>
          <span>Expected handover</span>
          <strong>{formatDate(project.expected_handover_date)}</strong>
        </div>
        <div>
          <span>Milestones</span>
          <strong>
            {milestones.filter((item) => item.completed).length} of{" "}
            {milestones.length} complete
          </strong>
        </div>
      </div>

      <div className="pp-detail-columns">
        <section className="pp-panel">
          <span className="pp-eyebrow">UPDATE TRACKER</span>
          <h3>Update project progress</h3>

          <label className="pp-detail-label">
            Progress: {progress}%
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(event) => setProgress(Number(event.target.value))}
            />
          </label>

          <label className="pp-detail-label">
            Current status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button
            className="pp-button pp-button-primary"
            onClick={handleSaveProgress}
            disabled={savingProgress}
          >
            {savingProgress ? "Saving…" : "Save progress"}
          </button>
        </section>

        <section className="pp-panel">
          <span className="pp-eyebrow">SITE COMMUNICATION</span>
          <h3>Latest project update</h3>
          <textarea
            rows="5"
            value={updateText}
            onChange={(event) => setUpdateText(event.target.value)}
            placeholder="Record completed work, site conditions, or next steps…"
          />
          <button
            className="pp-button pp-button-primary"
            onClick={handleSaveUpdate}
            disabled={savingUpdate}
          >
            {savingUpdate ? "Saving…" : "Save update"}
          </button>
        </section>
      </div>

      <section className="pp-panel pp-detail-milestones">
        <span className="pp-eyebrow">EXECUTION PLAN</span>
        <h3>Project milestones</h3>

        {milestones.length === 0 ? (
          <p className="pp-muted">
            No milestones have been recorded for this project yet.
          </p>
        ) : (
          <ul className="pp-milestone-list">
            {milestones.map((item, index) => (
              <li key={`${item.title}-${index}`}>
                <span
                  className={`pp-milestone-dot ${
                    item.completed ? "is-complete" : ""
                  }`}
                >
                  {item.completed ? "✓" : index + 1}
                </span>
                <span>{item.title}</span>
                <span className="pp-milestone-state">
                  {item.completed ? "Completed" : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
