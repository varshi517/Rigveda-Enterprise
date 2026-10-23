
import { useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase.js";
import StatusMessage from "../components/StatusMessage.jsx";
import CustomerManagement from "./CustomerManagement.jsx";
import FollowUpManagement from "./FollowUpManagement.jsx";
import ProjectsManagement from "./ProjectsManagement.jsx";
import ReportsManagement from "./ReportsManagement.jsx";
import "./dashboard.css";

const TABLES = ["enquiries", "customers", "projects", "follow_ups"];

const STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Closed" },
];

const OVERVIEW_CARDS = [
  {
    key: "enquiries",
    label: "Total Enquiries",
    icon: "✉",
    className: "overview-enquiries",
  },
  {
    key: "customers",
    label: "Total Customers",
    icon: "♙",
    className: "overview-customers",
  },
  {
    key: "projects",
    label: "Total Projects",
    icon: "▤",
    className: "overview-projects",
  },
  {
    key: "follow_ups",
    label: "Total Follow-ups",
    icon: "✓",
    className: "overview-followups",
  },
];

export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [section, setSection] = useState("enquiries");
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [overviewCounts, setOverviewCounts] = useState({
    enquiries: 0,
    customers: 0,
    projects: 0,
    follow_ups: 0,
  });

  // Check for an existing Supabase session.
  useEffect(() => {
    if (!supabase) {
      setCheckingSession(false);
      return;
    }

    let active = true;

    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!active) return;

        if (error) throw error;

        setSession(data.session ?? null);
      } catch (error) {
        if (active) {
          setMessage(error.message || "Could not check your session.");
          setMessageType("error");
        }
      } finally {
        if (active) setCheckingSession(false);
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setCheckingSession(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load counts when signed in.
  useEffect(() => {
    if (!session || !supabase) {
      setOverviewCounts({
        enquiries: 0,
        customers: 0,
        projects: 0,
        follow_ups: 0,
      });
      return;
    }

    let cancelled = false;

    async function loadOverviewCounts() {
      const results = await Promise.all(
        TABLES.map((table) =>
          supabase
            .from(table)
            .select("*", { count: "exact", head: true })
        )
      );

      if (cancelled) return;

      const nextCounts = {};

      TABLES.forEach((table, index) => {
        const result = results[index];
        nextCounts[table] = result.error ? 0 : (result.count ?? 0);
      });

      setOverviewCounts(nextCounts);
    }

    loadOverviewCounts();

    return () => {
      cancelled = true;
    };
  }, [session]);

  // Load records for the selected section.
  async function load() {
    if (!supabase || !session) return;

    if (section === "customers" || section === "follow_ups") {
      setRows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from(section)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;

      setRows(data || []);
    } catch (error) {
      setRows([]);
      setMessage(error.message || "Could not load records.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!session) {
      setRows([]);
      return;
    }

    if (section === "customers" || section === "follow_ups") {
      setRows([]);
      setLoading(false);
      setMessage("");
      return;
    }

    load();

    // Loading depends on the selected section and current session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, section]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !term ||
        [
          row.customer_name,
          row.name,
          row.phone,
          row.email,
          row.service,
          row.company,
          row.message,
          row.notes,
        ].some((value) =>
          String(value || "").toLowerCase().includes(term)
        );

      const matchesStatus =
        statusFilter === "all" || row.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  const enquiryCounts = useMemo(
    () => ({
      total: rows.length,
      new: rows.filter((row) => row.status === "new").length,
      contacted: rows.filter((row) => row.status === "contacted").length,
      inProgress: rows.filter((row) => row.status === "in_progress").length,
      completed: rows.filter((row) => row.status === "completed").length,
    }),
    [rows]
  );

  async function login(event) {
    event.preventDefault();

    if (!supabase) return;

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      setPassword("");
      window.location.hash = "#/dashboard";
    } catch (error) {
      setMessage(error.message || "Sign-in failed.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    if (!supabase) return;

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setSession(null);
      setPassword("");
      setRows([]);
      window.location.hash = "#/admin-login";
    } catch (error) {
      setMessage(error.message || "Could not sign out.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(row, value) {
    if (!supabase || !session) return;

    const previousRows = rows;

    setRows((current) =>
      current.map((item) =>
        item.id === row.id ? { ...item, status: value } : item
      )
    );

    setMessage("");

    try {
      const { error } = await supabase
        .from(section)
        .update({ status: value })
        .eq("id", row.id);

      if (error) throw error;

      setMessage("Status updated successfully.");
      setMessageType("success");
    } catch (error) {
      setRows(previousRows);
      setMessage(error.message || "Could not update status.");
      setMessageType("error");
    }
  }

  // Configuration check.
  if (!isSupabaseConfigured || !supabase) {
    return (
      <main className="dash-shell">
        <h1>Rigveda Partner Dashboard</h1>
        <StatusMessage type="error">
          Supabase is not configured. Check your environment variables.
        </StatusMessage>
        <a href="/">Return to website</a>
      </main>
    );
  }

  // Prevent a login-screen flash while restoring the session.
  if (checkingSession) {
    return (
      <main className="dash-shell">
        <p>Checking secure session…</p>
      </main>
    );
  }

  // Sign-in screen.
  if (!session) {
    return (
      <main className="dash-shell">
        <a href="/">← Public website</a>

        <section className="login-card">
          <img src="/rigveda-logo.png" alt="Rigveda Enterprises logo" />

          <h1>Admin sign in</h1>
          <p>Private access for authorized administrators only.</p>

          <form onSubmit={login}>
            <label>
              Email
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {message && (
            <StatusMessage type={messageType}>
              {message}
            </StatusMessage>
          )}

          <small>
            Sign in with the administrator account created in Supabase.
            Public sign-up should remain disabled.
          </small>
        </section>
      </main>
    );
  }

  // Authenticated dashboard.
  return (
    <main className="dash-shell">
      <header className="dash-header">
        <div>
          <span>RIGVEDA ENTERPRISES</span>
          <h1>Business dashboard</h1>
        </div>

        <button type="button" onClick={logout} disabled={loading}>
          {loading ? "Please wait…" : "Sign out"}
        </button>
      </header>

      <section className="dashboard-overview">
        {OVERVIEW_CARDS.map((card) => (
          <article
            className={`overview-card ${card.className}`}
            key={card.key}
          >
            <span className="overview-icon" aria-hidden="true">
              {card.icon}
            </span>
            <div>
              <p>{card.label}</p>
              <strong>{overviewCounts[card.key]}</strong>
            </div>
          </article>
        ))}
      </section>

      <nav className="dash-tabs">
        {TABLES.map((table) => (
          <button
            type="button"
            className={section === table ? "active" : ""}
            key={table}
            onClick={() => {
              setSection(table);
              setSearch("");
              setStatusFilter("all");
              setMessage("");
            }}
          >
            {table === "follow_ups"
              ? "Follow-ups"
              : table[0].toUpperCase() + table.slice(1)}
          </button>
        ))}

        <button
          type="button"
          className={section === "reports" ? "active" : ""}
          onClick={() => {
            setSection("reports");
            setSearch("");
            setStatusFilter("all");
            setMessage("");
          }}
        >
          Reports &amp; Analytics
        </button>

        <a href="/">View website ↗</a>
      </nav>

      {section === "customers" ? (
        <CustomerManagement />
      ) : section === "follow_ups" ? (
        <FollowUpManagement />
      ) : section === "projects" ? (
        <ProjectsManagement />
      ) : section === "reports" ? (
        <ReportsManagement />
      ) : (
        <>
          {message && (
            <StatusMessage type={messageType}>
              {message}
            </StatusMessage>
          )}

          {section === "enquiries" && (
            <section className="enquiry-summary">
              {[
                { label: "Loaded Enquiries", value: enquiryCounts.total },
                { label: "New", value: enquiryCounts.new },
                { label: "Contacted", value: enquiryCounts.contacted },
                { label: "In Progress", value: enquiryCounts.inProgress },
                { label: "Completed", value: enquiryCounts.completed },
              ].map((item) => (
                <article className="enquiry-stat" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </section>
          )}

          <section className="dash-table-wrap">
            <div className="dash-table-title">
              <h2>
                {section[0].toUpperCase() + section.slice(1)}
              </h2>

              <button type="button" onClick={load} disabled={loading}>
                {loading ? "Refreshing…" : "Refresh"}
              </button>
            </div>

            <div className="dash-filters">
              <input
                type="search"
                placeholder="Search name, phone, email..."
                aria-label="Search records"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All statuses</option>
                {STATUSES.map((status) => (
                  <option value={status.value} key={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <p>Loading records…</p>
            ) : filteredRows.length === 0 ? (
              <p>
                {rows.length === 0
                  ? "No records found yet."
                  : "No records match your search or filter."}
              </p>
            ) : (
              <>
                <p className="dash-result-count">
                  Showing {filteredRows.length} of {rows.length} loaded
                  records
                </p>

                <div className="dash-records">
                  {filteredRows.map((row) => (
                    <article className="dash-record" key={row.id}>
                      <div>
                        <strong>
                          {row.customer_name || row.name || "Record"}
                        </strong>

                        <p>
                          {row.email || row.phone || row.company || ""}
                        </p>

                        {row.phone && row.email && <p>{row.phone}</p>}

                        <p>
                          {row.service || row.notes || row.message || ""}
                        </p>

                        <small>
                          {row.created_at
                            ? new Date(row.created_at).toLocaleString()
                            : ""}
                        </small>
                      </div>

                      {row.status && (
                        <select
                          aria-label={`Status for ${
                            row.customer_name || row.name || "record"
                          }`}
                          value={row.status}
                          onChange={(event) =>
                            updateStatus(row, event.target.value)
                          }
                        >
                          {STATUSES.map((status) => (
                            <option
                              value={status.value}
                              key={status.value}
                            >
                              {status.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>

          <p className="dash-note">
            Enquiry counts and search cover the latest 200 records loaded
            from the database. Database access must also be protected
            with appropriate Supabase RLS policies.
          </p>
        </>
      )}
    </main>
  );
}
