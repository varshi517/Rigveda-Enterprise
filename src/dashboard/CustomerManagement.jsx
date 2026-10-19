import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import './customer-management.css';

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
};

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const notify = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
  };

  const loadCustomers = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      notify('Supabase is not configured.', 'error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, phone, email')
        .order('name', { ascending: true });

      if (error) throw error;

      setCustomers(data || []);
    } catch (error) {
      notify(error.message || 'Could not load customers.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!supabase) {
      notify('Supabase is not configured.', 'error');
      return;
    }

    const customer = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
    };

    if (!customer.name || !customer.phone) {
      notify('Please enter the customer name and phone number.', 'error');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      if (editingId !== null) {
        const { data, error } = await supabase
          .from('customers')
          .update(customer)
          .eq('id', editingId)
          .select('id, name, phone, email')
          .single();

        if (error) throw error;

        setCustomers((current) =>
          current.map((item) => (item.id === editingId ? data : item))
        );

        notify('Customer updated successfully.');
      } else {
        const { data, error } = await supabase
          .from('customers')
          .insert(customer)
          .select('id, name, phone, email')
          .single();

        if (error) throw error;

        setCustomers((current) =>
          [...current, data].sort((a, b) =>
            (a.name || '').localeCompare(b.name || '')
          )
        );

        notify('Customer added successfully.');
      }

      resetForm();
    } catch (error) {
      notify(error.message || 'Could not save the customer.', 'error');
    } finally {
      setSaving(false);
    }
  }

  function startEditing(customer) {
    setEditingId(customer.id);
    setForm({
      name: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
    });
    setMessage('');

    document
      .getElementById('customer-management-form')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function handleDelete(customer) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${customer.name}? This cannot be undone.`
    );

    if (!confirmed || !supabase) return;

    setDeletingId(customer.id);
    setMessage('');

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customer.id);

      if (error) throw error;

      setCustomers((current) =>
        current.filter((item) => item.id !== customer.id)
      );

      if (editingId === customer.id) resetForm();

      notify('Customer deleted successfully.');
    } catch (error) {
      notify(error.message || 'Could not delete the customer.', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  const term = search.trim().toLowerCase();

  const filteredCustomers = customers.filter((customer) =>
    [customer.name, customer.phone, customer.email].some((value) =>
      String(value || '').toLowerCase().includes(term)
    )
  );

  return (
    <div className="customer-management">
      <header className="customer-heading">
        <div>
          <span className="customer-eyebrow">RIGVEDA ENTERPRISES</span>
          <h2>Customer Management</h2>
          <p>Manage your customer contact details in one place.</p>
        </div>

        <button
          type="button"
          className="customer-refresh"
          onClick={loadCustomers}
          disabled={loading}
        >
          {loading ? 'Loading…' : '↻ Refresh'}
        </button>
      </header>

      {message && (
        <div
          className={`customer-message ${messageType}`}
          role="status"
        >
          {message}
        </div>
      )}

      <section
        className="customer-form-card"
        id="customer-management-form"
      >
        <div className="customer-section-heading">
          <div>
            <h3>{editingId !== null ? 'Edit Customer' : 'Add Customer'}</h3>
            <p>
              {editingId !== null
                ? 'Update the customer details below.'
                : 'Enter the details to create a customer record.'}
            </p>
          </div>

          <span className="customer-form-icon" aria-hidden="true">
            +
          </span>
        </div>

        <form onSubmit={handleSubmit} className="customer-form">
          <label>
            Customer name *
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
              maxLength={120}
              required
            />
          </label>

          <label>
            Phone number *
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
              maxLength={30}
              required
            />
          </label>

          <label className="customer-email-field">
            Email address
            <input
              type="email"
              name="email"
              placeholder="customer@example.com"
              value={form.email}
              onChange={handleChange}
              maxLength={254}
            />
          </label>

          <div className="customer-form-actions">
            <button
              type="submit"
              className="customer-primary-button"
              disabled={saving}
            >
              {saving
                ? 'Saving…'
                : editingId !== null
                  ? 'Save Changes'
                  : 'Add Customer'}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="customer-cancel-button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="customer-list-card">
        <div className="customer-list-heading">
          <div>
            <h3>All Customers</h3>
            <p>
              {filteredCustomers.length} of {customers.length} customers
            </p>
          </div>

          <span className="customer-count">{customers.length}</span>
        </div>

        <div className="customer-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search by name, phone, or email..."
            aria-label="Search customers"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <div className="customer-empty">Loading customers…</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="customer-empty">
            <span className="customer-empty-icon" aria-hidden="true">
              ♙
            </span>

            <strong>
              {customers.length === 0
                ? 'No customers yet'
                : 'No matching customers'}
            </strong>

            <p>
              {customers.length === 0
                ? 'Add your first customer using the form above.'
                : 'Try another name, phone number, or email.'}
            </p>
          </div>
        ) : (
          <div className="customer-record-list">
            {filteredCustomers.map((customer) => (
              <article className="customer-record" key={customer.id}>
                <div className="customer-avatar" aria-hidden="true">
                  {(customer.name || '?').trim().charAt(0).toUpperCase()}
                </div>

                <div className="customer-record-info">
                  <h4>{customer.name}</h4>
                  <p>☎ {customer.phone}</p>

                  {customer.email && <p>✉ {customer.email}</p>}
                </div>

                <div className="customer-record-actions">
                  <button
                    type="button"
                    onClick={() => startEditing(customer)}
                    aria-label={`Edit ${customer.name}`}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="customer-delete-button"
                    onClick={() => handleDelete(customer)}
                    disabled={deletingId === customer.id}
                    aria-label={`Delete ${customer.name}`}
                  >
                    {deletingId === customer.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}