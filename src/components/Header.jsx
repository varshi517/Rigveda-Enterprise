
import { useState } from "react";
import {
  ArrowRight,
  Menu,
  X,
  Phone,
  MessageCircle,
} from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <a href="#home" className="brand" onClick={closeMenu}>
        <div className="brand-mark">
          <img
            className="brand-logo"
            src="/rigveda-logo.png"
            alt="Rigveda Enterprises logo"
          />
        </div>

        <div className="brand-text">
          <strong>RIGVEDA</strong>
          <span>ENTERPRISES</span>
        </div>
      </a>

      <nav
        className={menuOpen ? "nav-links mobile-open" : "nav-links"}
      >
        <a href="#home" onClick={closeMenu}>
          Home
        </a>

        <a href="#about" onClick={closeMenu}>
          About
        </a>

        <a href="#services" onClick={closeMenu}>
          Services
        </a>

        <a href="#projects" onClick={closeMenu}>
          Projects
        </a>

        <a href="#contact" onClick={closeMenu}>
          Contact
        </a>
      </nav>

      <div className="header-actions">
        <a
          href="tel:+919121043579"
          className="header-contact-icon"
          aria-label="Call Rigveda Enterprises"
          title="Call +91 9121043579"
        >
          <Phone size={18} />
        </a>

        <a
          href="https://wa.me/919121043579"
          className="header-contact-icon whatsapp-icon"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Rigveda Enterprises on WhatsApp"
          title="WhatsApp +91 9121043579"
        >
          <MessageCircle size={19} />
        </a>

        <a
          href="#contact"
          className="nav-cta"
          onClick={closeMenu}
        >
          Get a Quote
          <ArrowRight size={16} />
        </a>
      </div>

      <button
        type="button"
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={25} /> : <Menu size={25} />}
      </button>
    </header>
  );
}
