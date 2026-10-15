import { ArrowRight, Building2, CheckCircle2, ChevronRight, Droplets, HardHat, Mail, MapPin, Menu, Phone, Paintbrush, ShieldCheck, Sparkles, Wrench, X, Zap, MessageCircle } from "lucide-react";

export default function Hero() { return (
        <section id="home" className="hero">

          <div className="hero-background-image"></div>

          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-brand-emblem">
              <img src="/rigveda-logo.png" alt="Rigveda Enterprises royal gold emblem" />
            </div>

            <div className="hero-badge">

              <Sparkles size={15} />

              Engineering • Maintenance • Facility Management

            </div>

            <h1>
              Building better.

              <span>Maintaining smarter.</span>

            </h1>
            <p>
              Rigveda Enterprises delivers integrated MEP, facility

              management, maintenance, civil and infrastructure solutions

              for modern workplaces and facilities.

            </p>
            <div className="hero-actions">
              <a href="#services" className="primary-button">

                Explore Services

                <ArrowRight size={18} />

              </a>
              <a href="#contact" className="glass-button">

                Talk to Us

              </a>
            </div>

            <div className="hero-trust">
              <div className="trust-item">

                <CheckCircle2 size={17} />

                <span>Reliable Service</span>

              </div>
              <div className="trust-item">

                <CheckCircle2 size={17} />

                <span>Safety Focused</span>

              </div>
              <div className="trust-item">

                <CheckCircle2 size={17} />

                <span>Client Focused</span>

              </div>
            </div>
          </div>
          <div className="hero-side-card">
            <div className="side-card-icon">

              <ShieldCheck size={25} />

            </div>
            <span>ONE PARTNER</span>
            <h3>

              Multiple

              <br />

              Solutions.

            </h3>
            <p>

              From MEP systems to facility maintenance and infrastructure

              support.

            </p>
          </div>
        </section>
); }
