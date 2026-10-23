import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-background-image" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-brand-emblem">
          <img
            src="/rigveda-logo.png"
            alt="Rigveda Enterprises"
            fetchPriority="high"
          />
        </div>

        <div className="hero-badge">
          <Sparkles size={15} aria-hidden="true" />
          <span>Engineering · Maintenance · Facility Management</span>
        </div>

        <h1>
          Building better.
          <span>Maintaining smarter.</span>
        </h1>

        <p>
          Rigveda Enterprises delivers integrated MEP, facility
          management, maintenance, civil, and infrastructure
          solutions for modern workplaces and facilities.
        </p>

        <div className="hero-actions">
          <a href="#services" className="primary-button">
            Explore Services
            <ArrowRight size={18} aria-hidden="true" />
          </a>

          <a href="#contact" className="glass-button">
            Talk to Us
          </a>
        </div>

        <div className="hero-trust">
          <div className="trust-item">
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>Reliable Service</span>
          </div>

          <div className="trust-item">
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>Safety Focused</span>
          </div>

          <div className="trust-item">
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>Client Focused</span>
          </div>
        </div>
      </div>

      <aside className="hero-side-card">
        <div className="side-card-icon">
          <ShieldCheck size={25} aria-hidden="true" />
        </div>

        <span>ONE PARTNER</span>

        <h3>
          Multiple
          <br />
          Solutions.
        </h3>

        <p>
          From MEP systems to facility maintenance and
          infrastructure support.
        </p>
      </aside>
    </section>
  );
}