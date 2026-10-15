import { ArrowRight, Building2, CheckCircle2, ChevronRight, Droplets, HardHat, Mail, MapPin, Menu, Phone, Paintbrush, ShieldCheck, Sparkles, Wrench, X, Zap, MessageCircle } from "lucide-react";

export default function Projects() { return (
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
); }
