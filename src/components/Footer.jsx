
import { MapPin, Mail, Phone, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <div className="brand-mark">
          <img
            className="brand-logo"
            src="/rigveda-logo.png"
            alt="Rigveda Enterprises logo"
          />
        </div>

        <div>
          <strong>RIGVEDA ENTERPRISES</strong>
          <span>Projects · Maintenance · Technical Services</span>
        </div>
      </div>

      <div className="footer-contact-links">
        <a href="tel:+919705023115">
          <Phone size={15} aria-hidden="true" />
          EVM Pavan Kumar
        </a>

        <a href="tel:+919985811611">
          <Phone size={15} aria-hidden="true" />
          IVNS Raju
        </a>

        <a href="mailto:rigvedaenterprises.hyd@gmail.com">
          <Mail size={15} aria-hidden="true" />
          Email Rigveda
        </a>

        <span>
          <MapPin size={15} aria-hidden="true" />
          Hayathnagar, Hyderabad
        </span>

        <a
          href="https://rigvedaenterprises.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe size={15} aria-hidden="true" />
          rigvedaenterprises.com
        </a>
      </div>

      <div className="footer-right">
        <span>
          © {new Date().getFullYear()} Rigveda Enterprises
        </span>
        <span>All rights reserved.</span>
      </div>
    </footer>
  );
}
