
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div
        className="hero-background-image"
        aria-hidden="true"
      />

      <div
        className="hero-overlay"
        aria-hidden="true"
      />

      <div className="hero-content">
        {/* Official Rigveda Enterprises logo */}
        <div className="hero-brand-emblem">
          <img
            src="/rigveda-logo.png"
            alt="Rigveda Enterprises"
            fetchPriority="high"
          />
        </div>

        <div className="hero-badge">
          <Sparkles size={15} aria-hidden="true" />
          <span>
            Projects · Maintenance · Technical Services
          </span>
        </div>

        <h1>
          Engineering projects.
          <span>Technical maintenance.</span>
        </h1>

        <p>
          Rigveda Enterprises undertakes electrical, HVAC, mechanical,
          civil, fire and CCTV projects. Our technical services include
          annual maintenance contracts, breaker maintenance, relay
          testing, calibration and troubleshooting.
        </p>

        <div className="hero-actions">
          <a href="#services" className="primary-button">
            Explore Services
            <ArrowRight size={18} aria-hidden="true" />
          </a>

          <a href="#contact" className="glass-button">
            Contact Our Partners
          </a>
        </div>

        <div className="hero-trust">
          <div className="trust-item">
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>Project Works</span>
          </div>

          <div className="trust-item">
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>Maintenance Services</span>
          </div>

          <div className="trust-item">
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>Technical Support</span>
          </div>
        </div>
      </div>

      <aside className="hero-side-card">
        <div className="side-card-icon">
          <ShieldCheck size={25} aria-hidden="true" />
        </div>

        <span>RIGVEDA ENTERPRISES</span>

        <h3>
          Projects &
          <br />
          Maintenance.
        </h3>

        <p>
          Electrical, HVAC, mechanical, civil, fire and CCTV project
          works, supported by specialist maintenance services.
        </p>
      </aside>
    </section>
  );
}
