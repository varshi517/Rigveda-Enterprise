
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

function PublicWebsite() {
  return (
    <div className="app">
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

export default function App() {
  const getRoute = () => window.location.hash || "#/";

  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  if (route === "#/admin-login" || route === "#/dashboard") {
    return <Dashboard />;
  }

  return <PublicWebsite />;
}
