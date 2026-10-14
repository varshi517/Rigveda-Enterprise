import {

  ArrowRight,

  Building2,

  CheckCircle2,

  ChevronRight,

  Droplets,

  HardHat,
  Mail,

  MapPin,

  Menu,

  Phone,

  Paintbrush,

  ShieldCheck,

  Sparkles,

  Wrench,

  X,

  Zap,

  MessageCircle,

} from "lucide-react";



import { useState } from "react";

import "./App.css";



function App() {

  const [menuOpen, setMenuOpen] = useState(false);



  const closeMenu = () => setMenuOpen(false);



  const services = [

    {

      icon: Wrench,

      number: "01",

      title: "Mechanical",

      text: "Mechanical installation, maintenance and equipment support for efficient facility operations.",

    },

    {

      icon: Zap,

      number: "02",

      title: "Electrical",

      text: "Electrical systems, maintenance and support designed around safety and reliability.",

    },

    {

      icon: Droplets,

      number: "03",

      title: "Plumbing",

      text: "Professional plumbing installation, repair and preventive maintenance solutions.",

    },

    {

      icon: Building2,

      number: "04",

      title: "Facility Management",

      text: "Integrated facility support to keep buildings functional, efficient and well maintained.",

    },

    {

      icon: Paintbrush,

      number: "05",

      title: "Painting & Civil",

      text: "Painting, renovation, repair and general civil works for commercial and industrial spaces.",

    },

    {

      icon: HardHat,

      number: "06",

      title: "Road & Infrastructure",

      text: "Infrastructure, road-related works and site support with attention to safety and execution.",

    },

  ];



  const highlights = [

    {

      number: "01",

      title: "Quality",

      text: "Focused on dependable workmanship and practical solutions.",

    },

    {

      number: "02",

      title: "Safety",

      text: "Safety-conscious execution across maintenance and site activities.",

    },

    {

      number: "03",

      title: "Reliability",

      text: "Responsive support designed around client requirements.",

    },

  ];



  return (

    <div className="app">



      {/\* ================= NAVBAR ================= */}



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





      {/\* ================= HERO ================= */}



      <main>



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





        {/\* ================= QUICK STATS ================= */}



        <section className="stats">



          <div className="stat-item">

            <strong>MEP</strong>

            <span>Engineering Services</span>

          </div>



          <div className="stat-item">

            <strong>FM</strong>

            <span>Facility Management</span>

          </div>



          <div className="stat-item">

            <strong>24/7</strong>

            <span>Maintenance Mindset</span>

          </div>



          <div className="stat-item">

            <strong>01</strong>

            <span>Integrated Partner</span>

          </div>



        </section>





        {/\* ================= ABOUT ================= */}



        <section id="about" className="about-section">



          <div className="section-intro">



            <div>

              <span className="section-tag">ABOUT RIGVEDA</span>



              <h2>

                Practical expertise.

                <br />

                <em>Real-world solutions.</em>

              </h2>

            </div>



            <div className="section-intro-text">

              <p>

                Rigveda Enterprises is focused on delivering dependable

                engineering, maintenance and facility-management services

                for organizations that need their spaces and systems to

                work efficiently.

              </p>



              <a href="#contact" className="text-link">

                Work with us

                <ChevronRight size={17} />

              </a>

            </div>



          </div>





          <div className="about-grid">



            <div className="about-image">

              <div className="image-label">

                <span>RIGVEDA</span>

                <strong>Built around service.</strong>

              </div>

            </div>



            <div className="about-details">



              <div className="about-number">01</div>



              <h3>

                More than maintenance.

              </h3>



              <p>

                We bring together multiple technical and support services

                so clients can manage their facility requirements through

                one dependable partner.

              </p>



              <div className="check-list">



                <div>

                  <CheckCircle2 size={18} />

                  <span>Integrated service approach</span>

                </div>



                <div>

                  <CheckCircle2 size={18} />

                  <span>Quality-focused execution</span>

                </div>



                <div>

                  <CheckCircle2 size={18} />

                  <span>Safety-conscious operations</span>

                </div>



                <div>

                  <CheckCircle2 size={18} />

                  <span>Responsive client support</span>

                </div>



              </div>



            </div>



          </div>



        </section>





        {/\* ================= SERVICES ================= */}



        <section id="services" className="services-section">



          <div className="services-heading">



            <div>

              <span className="section-tag">OUR EXPERTISE</span>



              <h2>

                Services that

                <br />

                <em>keep things moving.</em>

              </h2>

            </div>



            <p>

              From essential MEP systems to facility operations,

              infrastructure and maintenance, our services are designed

              around practical requirements.

            </p>



          </div>





          <div className="services-grid">



            {services.map((service) => {

              const Icon = service.icon;



              return (

                <article className="service-card" key={service.number}>



                  <div className="service-top">



                    <span className="service-number">

                      {service.number}

                    </span>



                    <div className="service-icon">

                      <Icon size={25} strokeWidth={1.8} />

                    </div>



                  </div>



                  <h3>{service.title}</h3>



                  <p>{service.text}</p>



                  <div className="service-arrow">

                    <ArrowRight size={19} />

                  </div>



                </article>

              );

            })}



          </div>



        </section>





        {/\* ================= WHY RIGVEDA ================= */}



        <section className="why-section">



          <div className="why-image"></div>



          <div className="why-content">



            <span className="section-tag">WHY RIGVEDA</span>



            <h2>

              One team.

              <br />

              <em>Many capabilities.</em>

            </h2>



            <p>

              Facility requirements rarely fit into a single category.

              That's why Rigveda brings multiple capabilities together,

              making it easier to coordinate maintenance and support.

            </p>



            <div className="highlight-list">



              {highlights.map((item) => (

                <div className="highlight" key={item.number}>



                  <span>{item.number}</span>



                  <div>

                    <h3>{item.title}</h3>

                    <p>{item.text}</p>

                  </div>



                </div>

              ))}



            </div>



          </div>



        </section>





        {/\* ================= PROJECTS ================= */}



        <section id="projects" className="projects-section">



          <div className="projects-heading">



            <div>

              <span className="section-tag">OUR WORK</span>



              <h2>

                Projects &

                <br />

                <em>experience.</em>

              </h2>

            </div>



            <p>

              Real project photographs, client sectors and completed work

              can be showcased here as Rigveda's portfolio grows.

            </p>



          </div>





          <div className="project-grid">



            <div className="project-card project-large">

              <div className="project-overlay">

                <span>01 / FACILITY</span>

                <h3>Facility Management</h3>

              </div>

            </div>



            <div className="project-card project-small">

              <div className="project-overlay">

                <span>02 / MEP</span>

                <h3>MEP Services</h3>

              </div>

            </div>



            <div className="project-card project-small project-three">

              <div className="project-overlay">

                <span>03 / INFRASTRUCTURE</span>

                <h3>Infrastructure Works</h3>

              </div>

            </div>



          </div>



        </section>





        {/\* ================= CTA ================= */}



        <section className="cta-section">



          <div className="cta-decoration">

            <Wrench size={120} strokeWidth={0.6} />

          </div>



          <div className="cta-content">



            <span className="section-tag">LET'S BUILD SOMETHING</span>



            <h2>

              Have a project

              <br />

              <em>in mind?</em>

            </h2>



            <p>

              Tell us what you need. We'll help you find the right

              solution.

            </p>



            <a href="#contact" className="primary-button">

              Start a Conversation

              <ArrowRight size={18} />

            </a>



          </div>



        </section>





        {/\* ================= CONTACT ================= */}



        <section id="contact" className="contact-section">



          <div className="contact-info">



            <span className="section-tag">CONTACT RIGVEDA</span>



            <h2>

              Let's talk about

              <br />

              <em>your requirements.</em>

            </h2>



            <p>

              Get in touch with Rigveda Enterprises for MEP,

              facility-management, maintenance and infrastructure

              requirements.

            </p>



            <div className="contact-details">



              <div className="contact-detail">

                <div>

                  <Phone size={20} />

                </div>

                <span>Phone</span>

                <a href="tel:+919121043579">+91 91210 43579</a>

              </div>

<a
  href="https://wa.me/919121043579"
  target="_blank"
  rel="noopener noreferrer"
  className="contact-detail whatsapp-contact"
>
  <div>
    <MessageCircle size={20} />
  </div>

  <span>WhatsApp</span>
  <strong>Chat with us</strong>
</a>

              <div className="contact-detail">

                <div>

                  <Mail size={20} />

                </div>

                <span>Email</span>

                <a href="mailto:bvarshi417@gmail.com">bvarshi417@gmail.com</a>

              </div>



              <div className="contact-detail">

                <div>

                  <MapPin size={20} />

                </div>

                <span>Location</span>

                <strong>Vanasthalipuram, Hyderabad, Telangana, India</strong>

              </div>



            </div>



          </div>



                <div className="contact-card">



  <div className="contact-card-header">

    <span>GET STARTED</span>

    <Sparkles size={19} />

  </div>



  <h3>

    Tell us what

    <br />

    you need.

  </h3>



  <p>

    Share your requirements with us and we'll get back to you.

  </p>



  <form className="enquiry-form">



    <div className="form-row">

      <div className="form-group">

        <label htmlFor="name">Name</label>

        <input

          id="name"

          type="text"

          placeholder="Your name"

          required

        />

      </div>



      <div className="form-group">

        <label htmlFor="phone">Phone</label>

        <input

          id="phone"

          type="tel"

          placeholder="Your phone number"

          required

        />

      </div>

    </div>



    <div className="form-group">

      <label htmlFor="email">Email</label>

      <input

        id="email"

        type="email"

        placeholder="Your email address"

        required

      />

    </div>



    <div className="form-group">

      <label htmlFor="service">Service Required</label>



      <select id="service" required>

        <option value="">Select a service</option>

        <option value="Mechanical">Mechanical</option>

        <option value="Electrical">Electrical</option>

        <option value="Plumbing">Plumbing</option>

        <option value="Facility Management">

          Facility Management

        </option>

        <option value="Painting & Civil">

          Painting & Civil

        </option>

        <option value="Road & Infrastructure">

          Road & Infrastructure

        </option>

        <option value="Other">Other</option>

      </select>

    </div>



    <div className="form-group">

      <label htmlFor="message">Your Requirement</label>



      <textarea

        id="message"

        rows="4"

        placeholder="Tell us briefly about your requirement..."

        required

      ></textarea>

    </div>



    <button type="submit" className="contact-card-button">

      Send Enquiry

      <ArrowRight size={18} />

    </button>



  </form>



</div>





        </section>



      </main>





      {/\* ================= FOOTER ================= */}



      <footer>



        <div className="footer-brand">



          <div className="brand-mark">
            <img className="brand-logo" src="/rigveda-logo.png" alt="Rigveda Enterprises logo" />
          </div>



          <div>

            <strong>RIGVEDA ENTERPRISES</strong>

            <span>

              Engineering • Maintenance • Facility Management

            </span>

          </div>



        </div>



        <div className="footer-right">

          <span>© {new Date().getFullYear()} Rigveda Enterprises</span>

          <span>All rights reserved.</span>

        </div>



      </footer>



    </div>

  );

}



export default App;