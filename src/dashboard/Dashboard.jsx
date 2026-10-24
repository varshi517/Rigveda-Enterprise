
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

function formatDate(date) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString();
}

function getStatusLabel(status) {
  return (
    STATUSES.find((item) => item.value === status)?.label ||
    status ||
    "New"
  );
}

export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [section, setSection] = useState("enquiries");
  const [rows, setRows] = useState([]);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingIds, setUpdatingIds] = useState([]);

  const [overviewCounts, setOverviewCounts] = useState({
    enquiries: 0,
    customers: 0,
    projects: 0,
    follow_ups: 0,
  });

  // --------------------------------------------------
  // Supabase authentication
  // --------------------------------------------------

  useEffect(() => {
    if (!supabase) {
      setSessionLoading(false);
      return undefined;
    }

    let active = true;

    async function getCurrentSession() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!active) return;

        if (error) {
          setMessage(error.message);
          setMessageType("error");
        } else {
          setSession(data.session);
        }
      } catch (error) {
        if (active) {
          setMessage(error?.message || "Unable to check your session.");
          setMessageType("error");
        }
      } finally {
        if (active) {
          setSessionLoading(false);
        }
      }
    }

    getCurrentSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (active) {
        setSession(newSession);
        setSessionLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // --------------------------------------------------
  // Load dashboard overview counts
  // --------------------------------------------------

  useEffect(() => {
    if (!session || !supabase) return undefined;

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

        nextCounts[table] = result.error ? 0 : result.count ?? 0;
      });

      setOverviewCounts(nextCounts);
    }

    loadOverviewCounts().catch((error) => {
      if (!cancelled) {
        console.error("Unable to load dashboard counts:", error);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [session]);

  // --------------------------------------------------
  // Load records for the selected section
  // --------------------------------------------------

  async function load() {
    if (!supabase || !session) return;

    if (
      section === "customers" ||
      section === "follow_ups" ||
      section === "reports"
    ) {
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
      console.error(`Unable to load ${section}:`, error);
      setRows([]);
      setMessage(error?.message || "Could not load records.");
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

    if (
      section === "customers" ||
      section === "follow_ups" ||
      section === "reports"
    ) {
      setRows([]);
      setLoading(false);
      setMessage("");
      return;
    }

    load();

    // load uses the current selected section.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, section]);

  // --------------------------------------------------
  // Search and status filtering
  // --------------------------------------------------

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rows.filter((row) => {
      const searchableValues = [
        row.customer_name,
        row.name,
        row.phone,
        row.email,
        row.service,
        row.company,
        row.message,
        row.description,
        row.notes,
        row.status,
      ];

      const matchesSearch =
        !term ||
        searchableValues.some((value) =>
          String(value ?? "").toLowerCase().includes(term)
        );

      const matchesStatus =
        statusFilter === "all" || row.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  // --------------------------------------------------
  // Enquiry status counts
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Partner login
  // --------------------------------------------------

  async function login(event) {
    event.preventDefault();

    if (!supabase) {
      setMessage("Supabase is not configured.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      setSession(data.session);
      setPassword("");
      setMessage("");
    } catch (error) {
      setMessage(error?.message || "Sign-in failed.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // Sign out
  // --------------------------------------------------

  async function logout() {
    if (!supabase) return;

    setMessage("");

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setSession(null);
      setRows([]);
      setSearch("");
      setStatusFilter("all");
    } catch (error) {
      setMessage(error?.message || "Could not sign out.");
      setMessageType("error");
    }
  }

  // --------------------------------------------------
  // Update enquiry or record status
  // --------------------------------------------------

  async function updateStatus(row, value) {
    if (!supabase || !row?.id) return;

    const previousRows = rows;

    setUpdatingIds((current) =>
      current.includes(row.id) ? current : [...current, row.id]
    );

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
      setMessage(error?.message || "Could not update status.");
      setMessageType("error");
    } finally {
      setUpdatingIds((current) =>
        current.filter((id) => id !== row.id)
      );
    }
  }

  // --------------------------------------------------
  // Supabase configuration screen
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Initial session loading
  // --------------------------------------------------

  if (sessionLoading) {
    return (
      <main className="dash-shell">
        <section className="login-card">
          <img src="/rigveda-logo.png" alt="Rigveda Enterprises logo" />
          <h1>Loading dashboard...</h1>
          <p>Please wait while we check your partner session.</p>
        </section>
      </main>
    );
  }

  // --------------------------------------------------
  // Partner sign-in screen
  // --------------------------------------------------

  if (!session) {
    return (
      <main className="dash-shell">
        <a href="/">← Public website</a>

        <section className="login-card">
          <img src="/rigveda-logo.png" alt="Rigveda Enterprises logo" />

          <h1>Partner sign in</h1>

          <p>Private access for authorized partners only.</p>

          <form onSubmit={login}>
            <label>
              Email
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your partner email"
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
                placeholder="Enter your password"
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {message && (
            <StatusMessage type={messageType}>
              {message}
            </StatusMessage>
          )}

          <small>
            Create authorized partner accounts in Supabase Authentication.
            Keep public sign-up disabled.
          </small>
        </section>
      </main>
    );
  }

  // --------------------------------------------------
  // Main dashboard
  // --------------------------------------------------

  return (
    <main className="dash-shell">
      <header className="dash-header">
        <div>
          <span>RIGVEDA ENTERPRISES</span>
          <h1>Business dashboard</h1>
        </div>

        <button type="button" onClick={logout}>
          Sign out
        </button>
      </header>

      {/* Overview cards */}

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
              <strong>{overviewCounts[card.key] ?? 0}</strong>
            </div>
          </article>
        ))}
      </section>

      {/* Dashboard navigation */}

      <nav className="dash-tabs" aria-label="Dashboard sections">
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

      {/* Specialized dashboard sections */}

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

          {/* Enquiry summary */}

          {section === "enquiries" && (
            <section className="enquiry-summary">
              {[
                { label: "Loaded Enquiries", value: enquiryCounts.total },
                { label: "New", value: enquiryCounts.new },
                { label: "Contacted", value: enquiryCounts.contacted },
                {
                  label: "In Progress",
                  value: enquiryCounts.inProgress,
                },
                { label: "Completed", value: enquiryCounts.completed },
              ].map((item) => (
                <article className="enquiry-stat" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </section>
          )}

          {/* Records */}

          <section className="dash-table-wrap">
            <div className="dash-table-title">
              <h2>
                {section === "enquiries"
                  ? "Customer Enquiries"
                  : section[0].toUpperCase() + section.slice(1)}
              </h2>

              <button
                type="button"
                onClick={load}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <div className="dash-filters">
              <input
                type="search"
                placeholder="Search name, phone, email, description..."
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
              <p>Loading records...</p>
            ) : filteredRows.length === 0 ? (
              <p>
                {rows.length === 0
                  ? "No records found yet."
                  : "No records match your search or status filter."}
              </p>
            ) : (
              <>
                <p className="dash-result-count">
                  Showing {filteredRows.length} of {rows.length} loaded
                  records
                </p>

                <div className="dash-records">
                  {filteredRows.map((row) => {
                    const customerName =
                      row.customer_name || row.name || "Record";

                    const description =
                      row.message ?? row.description ?? "";

                    return (
                      <article className="dash-record" key={row.id}>
                        <div className="dash-record-main">
                          <strong className="dash-record-name">
                            {customerName}
                          </strong>

                          {row.email && (
                            <p className="dash-record-email">
                              <strong>Email:</strong>{" "}
                              <a href={`mailto:${row.email}`}>
                                {row.email}
                              </a>
                            </p>
                          )}

                          {row.phone && (
                            <p className="dash-record-phone">
                              <strong>Phone:</strong>{" "}
                              <a href={`tel:${row.phone}`}>
                                {row.phone}
                              </a>
                            </p>
                          )}

                          {row.company && (
                            <p>
                              <strong>Company:</strong> {row.company}
                            </p>
                          )}

                          {row.service && (
                            <p className="dash-record-service">
                              <strong>Service:</strong> {row.service}
                            </p>
                          )}

                          {/* Main fix: display the enquiry message separately. */}

                          {String(description).trim() !== "" && (
                            <div className="dash-record-message">
                              <strong>Enquiry description</strong>
                              <p>{description}</p>
                            </div>
                          )}

                          {row.notes && (
                            <div className="dash-record-notes">
                              <strong>Notes</strong>
                              <p>{row.notes}</p>
                            </div>
                          )}

                          {row.status && (
                            <p className="dash-record-status">
                              <strong>Status:</strong>{" "}
                              {getStatusLabel(row.status)}
                            </p>
                          )}

                          <small className="dash-record-date">
                            Submitted: {formatDate(row.created_at)}
                          </small>
                        </div>

                        {row.status && (
                          <div className="dash-record-actions">
                            <label>
                              Update status
                              <select
                                aria-label={`Status for ${customerName}`}
                                value={row.status}
                                disabled={updatingIds.includes(row.id)}
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
                            </label>

                            {updatingIds.includes(row.id) && (
                              <small>Saving status...</small>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </section>

          <p className="dash-note">
            Counts and records reflect the latest 200 records loaded from
            the database. Dashboard access requires an authenticated
            partner account.
          </p>
        </>
      )}
    </main>
  );
}
