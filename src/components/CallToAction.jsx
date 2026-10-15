import { ArrowRight, Building2, CheckCircle2, ChevronRight, Droplets, HardHat, Mail, MapPin, Menu, Phone, Paintbrush, ShieldCheck, Sparkles, Wrench, X, Zap, MessageCircle } from "lucide-react";

export default function CallToAction() { return (
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
); }
