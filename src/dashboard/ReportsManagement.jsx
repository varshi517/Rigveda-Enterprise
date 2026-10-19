import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import StatusMessage from '../components/StatusMessage.jsx';
import './reports-management.css';

const ENQUIRY_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'closed', label: 'Closed' },
];

const PROJECT_STATUSES = ENQUIRY_STATUSES;

const TABLES = [
  { key: 'enquiries', label: 'Enquiries' },
  { key: 'customers', label: 'Customers' },
  { key: 'projects', label: 'Projects' },
  { key: 'follow_ups', label: 'Follow-ups' },
];

function emptyStatusCounts() {
  return Object.fromEntries(
    ENQUIRY_STATUSES.map((item) => [item.value, 0])
  );
}

function formatStatus(value) {
  return ENQUIRY_STATUSES.find((item) => item.value === value)?.label
    || value
    || 'Unknown';
}

function percent(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export default function ReportsManagement() {
  const [summary, setSummary] = useState({
    enquiries: 0,
    customers: 0,
    projects: 0,
    follow_ups: 0,
  });

  const [enquiryStatuses, setEnquiryStatuses] = useState(
    emptyStatusCounts()
  );

  const [projectStatuses, setProjectStatuses] = useState(
    emptyStatusCounts()
  );

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');

  const loadReports = useCallback(async () => {
    if (!supabase) {
      setMessage('Supabase is not configured.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const [enquiriesResult, customersResult, projectsResult, followUpsResult] =
        await Promise.all([
          supabase.from('enquiries').select('id', { count: 'exact', head: true }),
          supabase.from('customers').select('id', { count: 'exact', head: true }),
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('follow_ups').select('id', { count: 'exact', head: true }),
        ]);

      const countResults = [
        enquiriesResult,
        customersResult,
        projectsResult,
        followUpsResult,
      ];

      const failedCount = countResults.find((result) => result.error);

      if (failedCount) {
        throw failedCount.error;
      }

      const [enquiryRowsResult, projectRowsResult] = await Promise.all([
        supabase.from('enquiries').select('status'),
        supabase.from('projects').select('status'),
      ]);

      if (enquiryRowsResult.error) throw enquiryRowsResult.error;
      if (projectRowsResult.error) throw projectRowsResult.error;

      const nextEnquiryStatuses = emptyStatusCounts();
      const nextProjectStatuses = emptyStatusCounts();

      (enquiryRowsResult.data || []).forEach((row) => {
        if (Object.prototype.hasOwnProperty.call(nextEnquiryStatuses, row.status)) {
          nextEnquiryStatuses[row.status] += 1;
        }
      });

      (projectRowsResult.data || []).forEach((row) => {
        if (Object.prototype.hasOwnProperty.call(nextProjectStatuses, row.status)) {
          nextProjectStatuses[row.status] += 1;
        }
      });

      setSummary({
        enquiries: enquiriesResult.count ?? 0,
        customers: customersResult.count ?? 0,
        projects: projectsResult.count ?? 0,
        follow_ups: followUpsResult.count ?? 0,
      });

      setEnquiryStatuses(nextEnquiryStatuses);
      setProjectStatuses(nextProjectStatuses);
    } catch (error) {
      console.error('Load reports error:', error);
      setMessage(
        error.message ||
        'Could not load reports. Check your Supabase permissions.'
      );
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const completedEnquiries = enquiryStatuses.completed;
  const enquiryConversion = percent(completedEnquiries, summary.enquiries);
  const completedProjects = projectStatuses.completed;
  const projectCompletion = percent(completedProjects, summary.projects);

  function exportCSV() {
    const lines = [
      ['Rigveda Enterprises - Business Report'],
      ['Generated At', new Date().toLocaleString()],
      [],
      ['Business Summary'],
      ['Category', 'Total'],
      ...TABLES.map((table) => [table.label, summary[table.key]]),
      [],
      ['Enquiry Status Breakdown'],
      ['Status', 'Count'],
      ...ENQUIRY_STATUSES.map((item) => [
        item.label,
        enquiryStatuses[item.value],
      ]),
      [],
      ['Project Status Breakdown'],
      ['Status', 'Count'],
      ...PROJECT_STATUSES.map((item) => [
        item.label,
        projectStatuses[item.value],
      ]),
      [],
      ['Enquiry completion rate', `${enquiryConversion}%`],
      ['Project completion rate', `${projectCompletion}%`],
    ];

    const csv = lines
      .map((row) =>
        row
          .map((value) => {
            const safeValue = String(value ?? '');
            return `"${safeValue.replace(/"/g, '""')}"`;
          })
          .join(',')
      )
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'rigveda-business-report.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="reports-management">
      <header className="reports-header">
        <div>
          <span className="reports-eyebrow">BUSINESS INTELLIGENCE</span>
          <h2>Reports &amp; Analytics</h2>
          <p>Understand your business activity and project progress.</p>
        </div>

        <div className="reports-header-actions">
          <button
            type="button"
            className="reports-secondary-button"
            onClick={loadReports}
            disabled={loading}
          >
            {loading ? 'Refreshing…' : '↻ Refresh'}
          </button>

          <button
            type="button"
            className="reports-primary-button"
            onClick={exportCSV}
            disabled={loading}
          >
            ↓ Export CSV
          </button>
        </div>
      </header>

      {message && (
        <StatusMessage type={messageType}>
          {message}
        </StatusMessage>
      )}

      {loading ? (
        <div className="reports-loading">Loading business reports…</div>
      ) : (
        <>
          <section className="reports-summary-grid">
            {TABLES.map((table) => (
              <article className="reports-summary-card" key={table.key}>
                <span className={`reports-summary-icon icon-${table.key}`}>
                  {table.key === 'enquiries'
                    ? '✉'
                    : table.key === 'customers'
                      ? '♙'
                      : table.key === 'projects'
                        ? '▤'
                        : '✓'}
                </span>

                <div>
                  <p>{table.label}</p>
                  <strong>{summary[table.key]}</strong>
                  <small>Total records</small>
                </div>
              </article>
            ))}
          </section>

          <section className="reports-insights-grid">
            <article className="reports-panel">
              <div className="reports-panel-heading">
                <div>
                  <h3>Enquiry conversion</h3>
                  <p>Share of enquiries marked Completed</p>
                </div>

                <span className="reports-rate">
                  {enquiryConversion}%
                </span>
              </div>

              <div
                className="reports-progress-track"
                role="progressbar"
                aria-label="Enquiry completion rate"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={enquiryConversion}
              >
                <div
                  className="reports-progress-fill enquiry-progress"
                  style={{ width: `${enquiryConversion}%` }}
                />
              </div>

              <p className="reports-panel-footnote">
                {completedEnquiries} completed out of {summary.enquiries} total
                enquiries.
              </p>

              <div className="reports-status-list">
                {ENQUIRY_STATUSES.map((item) => {
                  const count = enquiryStatuses[item.value];

                  return (
                    <div className="reports-status-row" key={item.value}>
                      <span>
                        <i className={`status-dot dot-${item.value}`} />
                        {item.label}
                      </span>
                      <strong>{count}</strong>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="reports-panel">
              <div className="reports-panel-heading">
                <div>
                  <h3>Project progress</h3>
                  <p>Share of projects marked Completed</p>
                </div>

                <span className="reports-rate project-rate">
                  {projectCompletion}%
                </span>
              </div>

              <div
                className="reports-progress-track"
                role="progressbar"
                aria-label="Project completion rate"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={projectCompletion}
              >
                <div
                  className="reports-progress-fill project-progress"
                  style={{ width: `${projectCompletion}%` }}
                />
              </div>

              <p className="reports-panel-footnote">
                {completedProjects} completed out of {summary.projects} total
                projects.
              </p>

              <div className="reports-status-list">
                {PROJECT_STATUSES.map((item) => {
                  const count = projectStatuses[item.value];

                  return (
                    <div className="reports-status-row" key={item.value}>
                      <span>
                        <i className={`status-dot dot-${item.value}`} />
                        {item.label}
                      </span>
                      <strong>{count}</strong>
                    </div>
                  );
                })}
              </div>
            </article>
          </section>

          <section className="reports-panel reports-business-summary">
            <div className="reports-panel-heading">
              <div>
                <h3>Business summary</h3>
                <p>Current record totals across your business workspace.</p>
              </div>
            </div>

            <div className="reports-summary-table-wrap">
              <table className="reports-summary-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Total records</th>
                    <th>Share of all records</th>
                  </tr>
                </thead>

                <tbody>
                  {TABLES.map((table) => {
                    const totalRecords = Object.values(summary).reduce(
                      (sum, value) => sum + value,
                      0
                    );
                    const share = percent(
                      summary[table.key],
                      totalRecords
                    );

                    return (
                      <tr key={table.key}>
                        <td>{table.label}</td>
                        <td>{summary[table.key]}</td>
                        <td>
                          <div className="reports-share-cell">
                            <div className="reports-mini-track">
                              <div
                                className="reports-mini-fill"
                                style={{ width: `${share}%` }}
                              />
                            </div>
                            <span>{share}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <p className="reports-disclaimer">
            These figures reflect records visible to your signed-in account.
            Enquiry completion rate means completed enquiries divided by all
            enquiries; it is not a verified sales or revenue conversion rate.
            Status breakdowns depend on records returned by Supabase.
          </p>
        </>
      )}
    </section>
  );
}
