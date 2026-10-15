import { ArrowRight, Building2, CheckCircle2, ChevronRight, Droplets, HardHat, Mail, MapPin, Menu, Phone, Paintbrush, ShieldCheck, Sparkles, Wrench, X, Zap, MessageCircle } from "lucide-react";

export default function About() { return (
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
); }
