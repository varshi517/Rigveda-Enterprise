import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import "./follow-up-management.css";

const EMPTY_FORM = {
  customer_name: "",
  phone: "",
  notes: "",
};

export default function FollowUpManagement() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [followUps, setFollowUps] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadFollowUps = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setError("Supabase is not configured. Please check your .env.local file.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("follow_ups")
      .select("id, customer_name, phone, notes")
      .order("id", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setFollowUps([]);
    } else {
      setFollowUps(data || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadFollowUps();
  }, [loadFollowUps]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.customer_name.trim() || !form.phone.trim() || !form.notes.trim()) {
      setError("Please fill in the customer name, phone number, and notes.");
      return;
    }

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    setSaving(true);

    const { data, error: insertError } = await supabase
      .from("follow_ups")
      .insert([
        {
          customer_name: form.customer_name.trim(),
          phone: form.phone.trim(),
          notes: form.notes.trim(),
        },
      ])
      .select("id, customer_name, phone, notes");

    if (insertError) {
      setError(insertError.message);
    } else {
      if (data?.length) {
        setFollowUps((previous) => [...data, ...previous]);
      } else {
        await loadFollowUps();
      }

      setForm(EMPTY_FORM);
      setSuccess("Follow-up saved successfully!");
    }

    setSaving(false);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this follow-up?"
    );

    if (!confirmed) return;

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    setError("");
    setSuccess("");
    setDeletingId(id);

    const { error: deleteError } = await supabase
      .from("follow_ups")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      setFollowUps((previous) =>
        previous.filter((item) => item.id !== id)
      );
      setSuccess("Follow-up deleted successfully.");
    }

    setDeletingId(null);
  }

  const filteredFollowUps = followUps.filter((item) => {
    const query = search.trim().toLowerCase();

    return (
      String(item.customer_name || "").toLowerCase().includes(query) ||
      String(item.phone || "").toLowerCase().includes(query) ||
      String(item.notes || "").toLowerCase().includes(query)
    );
  });

  return (
    <section className="follow-up-page">
      <div className="follow-up-heading">
        <div>
          <p className="follow-up-eyebrow">CUSTOMER RELATIONSHIPS</p>
          <h2>Follow-up Management</h2>
          <p className="follow-up-subtitle">
            Keep customer conversations and follow-up notes organized.
          </p>
        </div>

        <div className="follow-up-count">
          <span>Total Follow-ups</span>
          <strong>{followUps.length}</strong>
        </div>
      </div>

      {error && (
        <div className="follow-up-message follow-up-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="follow-up-message follow-up-success" role="status">
          {success}
        </div>
      )}

      <div className="follow-up-layout">
        <form className="follow-up-form" onSubmit={handleSubmit}>
          <div className="follow-up-form-heading">
            <span className="follow-up-icon">＋</span>
            <div>
              <h3>Add a Follow-up</h3>
              <p>Enter the customer's details below.</p>
            </div>
          </div>

          <label htmlFor="follow-up-customer-name">Customer Name</label>
          <input
            id="follow-up-customer-name"
            name="customer_name"
            type="text"
            placeholder="Enter customer name"
            value={form.customer_name}
            onChange={handleChange}
            maxLength={150}
            required
          />

          <label htmlFor="follow-up-phone">Phone Number</label>
          <input
            id="follow-up-phone"
            name="phone"
            type="tel"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={handleChange}
            maxLength={30}
            required
          />

          <label htmlFor="follow-up-notes">Follow-up Notes</label>
          <textarea
            id="follow-up-notes"
            name="notes"
            placeholder="What should you discuss with this customer?"
            value={form.notes}
            onChange={handleChange}
            rows={5}
            maxLength={3000}
            required
          />

          <button
            className="follow-up-save-button"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Follow-up"}
          </button>
        </form>

        <div className="follow-up-list-panel">
          <div className="follow-up-list-heading">
            <div>
              <h3>Saved Follow-ups</h3>
              <p>Records stored in your database</p>
            </div>

            <button
              type="button"
              className="follow-up-refresh-button"
              onClick={loadFollowUps}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <input
            className="follow-up-search"
            type="search"
            placeholder="Search name, phone, or notes..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search follow-ups"
          />

          {loading ? (
            <div className="follow-up-empty">Loading follow-ups...</div>
          ) : filteredFollowUps.length === 0 ? (
            <div className="follow-up-empty">
              <span className="follow-up-empty-icon">▤</span>
              <h4>{search ? "No matching follow-ups" : "No follow-ups yet"}</h4>
              <p>
                {search
                  ? "Try another search term."
                  : "Add your first follow-up using the form."}
              </p>
            </div>
          ) : (
            <div className="follow-up-records">
              {filteredFollowUps.map((item) => (
                <article className="follow-up-record" key={item.id}>
                  <div className="follow-up-record-top">
                    <div className="follow-up-avatar">
                      {(item.customer_name || "?").charAt(0).toUpperCase()}
                    </div>

                    <div className="follow-up-record-person">
                      <h4>{item.customer_name}</h4>
                      <a href={`tel:${item.phone}`}>{item.phone}</a>
                    </div>

                    <button
                      type="button"
                      className="follow-up-delete-button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      aria-label={`Delete follow-up for ${item.customer_name}`}
                      title="Delete follow-up"
                    >
                      {deletingId === item.id ? "..." : "Delete"}
                    </button>
                  </div>

                  <div className="follow-up-notes">
                    <span>FOLLOW-UP NOTES</span>
                    <p>{item.notes}</p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && filteredFollowUps.length > 0 && (
            <p className="follow-up-results">
              Showing {filteredFollowUps.length} of {followUps.length} records
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
