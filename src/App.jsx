
import { useEffect, useState } from "react";
import "./App.css";

import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Stats from "./components/Stats.jsx";
import About from "./components/About.jsx";
import Services from "./components/Services.jsx";
import Why from "./components/Why.jsx";
import Projects from "./components/Projects.jsx";
import CallToAction from "./components/CallToAction.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Dashboard from "./dashboard/Dashboard.jsx";

export default function App() {
  const [showDashboard, setShowDashboard] = useState(
    window.location.hash === "#/dashboard"
  );

  useEffect(() => {
    const handleHashChange = () => {
      setShowDashboard(window.location.hash === "#/dashboard");
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  if (showDashboard) {
    return <Dashboard />;
  }

  return (
    <div className="app">
      <a
        href="#/dashboard"
        style={{
          position: "fixed",
          right: "18px",
          bottom: "18px",
          zIndex: 9999,
          padding: "12px 18px",
          borderRadius: "8px",
          background: "#260806",
          color: "#f3d58a",
          textDecoration: "none",
          fontWeight: 700,
          boxShadow: "0 4px 14px rgba(0,0,0,0.2)"
        }}
      >
        Partner Login
      </a>

      <Header />

      <main>
        <Hero />
        <Stats />
        <About />
        <Services />
        <Why />
        <Projects />
        <CallToAction />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
