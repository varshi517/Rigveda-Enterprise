
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  MessageCircle,
  Globe,
} from "lucide-react";
import {
  supabase,
  isSupabaseConfigured,
} from "../lib/supabase.js";

const EMPTY_FORM = {
  customer_name: "",
  phone: "",
  email: "",
  service: "",
  message: "",
};

const SERVICES = [
  "Electrical Projects",
  "HVAC",
  "Mechanical",
  "Civil Works",
  "Fire & CCTV",
  "AMC & Breaker Maintenance",
  "Relay Testing",
  "Calibration & Troubleshooting",
  "Other",
];

const PARTNERS = [
  {
    name: "EVM Pavan Kumar",
    role: "Managing Partner",
    phone: "+919705023115",
    displayPhone: "+91 97050 23115",
  },
  {
    name: "IVNS Raju",
    role: "Managing Partner",
    phone: "+919985811611",
    displayPhone: "+91 99858 11611",
  },
];

const BUSINESS = {
  email: "rigvedaenterprises.hyd@gmail.com",
  location: "Hayathnagar, Hyderabad",
  website: "https://rigvedaenterprises.com",
};

export default function Contact() {
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    service: new URLSearchParams(window.location.search).get("service") || "",
  }));

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  useEffect(() => {
    function syncServiceFromUrl() {
      const requestedService =
        new URLSearchParams(window.location.search).get("service") || "";

      if (SERVICES.includes(requestedService)) {
        setForm((previous) => ({
          ...previous,
          service: requestedService,
        }));
      }
    }

    syncServiceFromUrl();
    window.addEventListener("popstate", syncServiceFromUrl);

    return () => {
      window.removeEventListener("popstate", syncServiceFromUrl);
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFeedback("");
    setFeedbackType("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback("");
    setFeedbackType("");

    if (!isSupabaseConfigured || !supabase) {
      setFeedback(
        "Our online enquiry service is temporarily unavailable. Please contact either managing partner by phone or WhatsApp."
      );
      setFeedbackType("error");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from("enquiries").insert([
        {
          customer_name: form.customer_name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          service: form.service,
          message: form.message.trim(),
          status: "new",
        },
      ]);

      if (error) throw error;

      setFeedback(
        "Thank you! Your enquiry has been sent successfully. Our team will get back to you."
      );
      setFeedbackType("success");

      setForm({
        ...EMPTY_FORM,
        service: "",
      });
    } catch (error) {
      console.error("Enquiry submission failed:", error);

      setFeedback(
        error?.message ||
          "We couldn't send your enquiry. Please try again or contact us directly."
      );
      setFeedbackType("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="contact-section">
      <div className="contact-info">
        <span className="section-tag">CONTACT RIGVEDA</span>

        <h2>
          Let's discuss
          <br />
          <em>your requirements.</em>
        </h2>

        <p>
          Contact our managing partners about electrical, HVAC,
          mechanical, civil, fire and CCTV projects, AMC, breaker
          maintenance, relay testing, calibration and troubleshooting.
        </p>

        <div className="contact-details">
          {PARTNERS.map((partner) => (
            <div className="contact-detail" key={partner.phone}>
              <div>
                <Phone size={20} aria-hidden="true" />
              </div>

              <span>{partner.role}</span>
              <strong>{partner.name}</strong>

              <a href={`tel:${partner.phone}`}>
                {partner.displayPhone}
              </a>

              <a
                className="partner-whatsapp-link"
                href={`https://wa.me/${partner.phone.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={16} aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          ))}

          <div className="contact-detail">
            <div>
              <Mail size={20} aria-hidden="true" />
            </div>
            <span>Email</span>
            <a href={`mailto:${BUSINESS.email}`}>
              {BUSINESS.email}
            </a>
          </div>

          <div className="contact-detail">
            <div>
              <MapPin size={20} aria-hidden="true" />
            </div>
            <span>Location</span>
            <strong>{BUSINESS.location}</strong>
          </div>

          <div className="contact-detail">
            <div>
              <Globe size={20} aria-hidden="true" />
            </div>
            <span>Website</span>
            <a
              href={BUSINESS.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              rigvedaenterprises.com
            </a>
          </div>
        </div>
      </div>

      <div className="contact-card">
        <div className="contact-card-header">
          <span>GET STARTED</span>
          <Sparkles size={19} aria-hidden="true" />
        </div>

        <h3>
          Tell us what
          <br />
          you need.
        </h3>

        <p>
          Share your requirements with Rigveda Enterprises.
        </p>

        <form className="enquiry-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="customer_name"
                type="text"
                placeholder="Your name"
                value={form.customer_name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Your phone number"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your email address"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="service">Service Required</label>
            <select
              id="service"
              name="service"
              value={form.service}
              onChange={handleChange}
              required
            >
              <option value="">Select a service</option>
              {SERVICES.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Requirement</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Tell us about your requirement..."
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>

          {feedback && (
            <p
              className={`enquiry-feedback ${feedbackType}`}
              role="status"
              aria-live="polite"
            >
              {feedback}
            </p>
          )}

          <button
            type="submit"
            className="contact-card-button"
            disabled={submitting}
          >
            {submitting ? "Sending..." : "Send Enquiry"}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
