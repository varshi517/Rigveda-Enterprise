
import { useState } from "react";
import {
  ArrowRight,
  Menu,
  X,
  Phone,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

const CONTACTS = [
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

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [callMenuOpen, setCallMenuOpen] = useState(false);
  const [whatsappMenuOpen, setWhatsappMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
    setCallMenuOpen(false);
    setWhatsappMenuOpen(false);
  };

  const toggleCallMenu = () => {
    setCallMenuOpen((open) => !open);
    setWhatsappMenuOpen(false);
  };

  const toggleWhatsappMenu = () => {
    setWhatsappMenuOpen((open) => !open);
    setCallMenuOpen(false);
  };

  const openWhatsApp = (phone) => {
    const number = phone.replace(/\D/g, "");

    window.open(
      `https://wa.me/${number}`,
      "_blank",
      "noopener,noreferrer"
    );

    setWhatsappMenuOpen(false);
  };

  return (
    <header className="navbar">
      {/* Official Rigveda Enterprises logo */}
      <a
        href="#home"
        className="brand official-brand"
        onClick={closeMenu}
        aria-label="Rigveda Enterprises home"
      >
        <img
          className="brand-logo official-brand-logo"
          src="/rigveda-logo.png"
          alt="Rigveda Enterprises"
        />
      </a>

      {/* Main navigation */}
      <nav
        className={menuOpen ? "nav-links mobile-open" : "nav-links"}
        aria-label="Main navigation"
      >
        <a href="#home" onClick={closeMenu}>Home</a>
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="#services" onClick={closeMenu}>Services</a>
        <a href="#projects" onClick={closeMenu}>Projects</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>
      </nav>

      {/* Contact actions */}
      <div className="header-actions">
        {/* Call dropdown */}
        <div className="call-dropdown">
          <button
            type="button"
            className="header-contact-icon"
            aria-label="Choose a managing partner to call"
            aria-expanded={callMenuOpen}
            aria-haspopup="true"
            title="Call Rigveda Enterprises"
            onClick={toggleCallMenu}
          >
            <Phone size={18} />
            <ChevronDown size={13} className="call-chevron" />
          </button>

          {callMenuOpen && (
            <>
              <button
                type="button"
                className="dropdown-backdrop"
                aria-label="Close call menu"
                onClick={() => setCallMenuOpen(false)}
              />

              <div className="call-dropdown-menu">
                <strong className="call-dropdown-title">
                  Call Our Managing Partners
                </strong>

                <p className="call-dropdown-description">
                  Choose whom you'd like to call.
                </p>

                {CONTACTS.map((person) => (
                  <a
                    key={person.phone}
                    href={`tel:${person.phone}`}
                    className="call-partner-link"
                    onClick={() => setCallMenuOpen(false)}
                  >
                    <span className="call-partner-icon">
                      <Phone size={16} />
                    </span>

                    <span className="call-partner-details">
                      <b>{person.name}</b>
                      <small>{person.role}</small>
                      <small>{person.displayPhone}</small>
                    </span>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        {/* WhatsApp dropdown */}
        <div className="whatsapp-dropdown">
          <button
            type="button"
            className="header-contact-icon whatsapp-icon"
            aria-label="Choose a managing partner for WhatsApp"
            aria-expanded={whatsappMenuOpen}
            aria-haspopup="true"
            title="WhatsApp Rigveda Enterprises"
            onClick={toggleWhatsappMenu}
          >
            <MessageCircle size={19} />
            <ChevronDown size={13} className="call-chevron" />
          </button>

          {whatsappMenuOpen && (
            <>
              <button
                type="button"
                className="dropdown-backdrop"
                aria-label="Close WhatsApp menu"
                onClick={() => setWhatsappMenuOpen(false)}
              />

              <div className="call-dropdown-menu whatsapp-menu">
                <strong className="call-dropdown-title">
                  WhatsApp Our Managing Partners
                </strong>

                <p className="call-dropdown-description">
                  Choose whom you'd like to message.
                </p>

                {CONTACTS.map((person) => (
                  <button
                    key={person.phone}
                    type="button"
                    className="call-partner-link whatsapp-partner-link"
                    onClick={() => openWhatsApp(person.phone)}
                  >
                    <span className="call-partner-icon whatsapp-partner-icon">
                      <MessageCircle size={17} />
                    </span>

                    <span className="call-partner-details">
                      <b>{person.name}</b>
                      <small>{person.role}</small>
                      <small>{person.displayPhone}</small>
                    </span>

                    <ArrowRight
                      size={16}
                      className="whatsapp-arrow"
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Get a quote */}
        <a
          href="#contact"
          className="nav-cta"
          onClick={closeMenu}
        >
          Get a Quote
          <ArrowRight size={16} />
        </a>
      </div>

      {/* Mobile navigation toggle */}
      <button
        type="button"
        className="menu-button"
        onClick={() => {
          setMenuOpen((open) => !open);
          setCallMenuOpen(false);
          setWhatsappMenuOpen(false);
        }}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={25} /> : <Menu size={25} />}
      </button>
    </header>
  );
}
