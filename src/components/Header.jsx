import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
      <header className="navbar">

        <a href="#home" className="brand" onClick={closeMenu}>

          <div className="brand-mark">
            <img className="brand-logo" src="/rigveda-logo.png" alt="Rigveda Enterprises logo" />
          </div>

          <div className="brand-text">

            <strong>RIGVEDA</strong>

            <span>ENTERPRISES</span>

          </div>

        </a>
        <nav className={menuOpen ? "nav-links mobile-open" : "nav-links"}>

          <a href="#home" onClick={closeMenu}>Home</a>

          <a href="#about" onClick={closeMenu}>About</a>

          <a href="#services" onClick={closeMenu}>Services</a>

          <a href="#projects" onClick={closeMenu}>Projects</a>

          <a href="#contact" onClick={closeMenu}>Contact</a>

        </nav>



        <a href="#contact" className="nav-cta">

          Get a Quote

          <ArrowRight size={16} />

        </a>
        <button

          className="menu-button"

          onClick={() => setMenuOpen(!menuOpen)}

          aria-label="Toggle navigation"

        >

          {menuOpen ? <X size={25} /> : <Menu size={25} />}

        </button>

      </header>
  );
}
