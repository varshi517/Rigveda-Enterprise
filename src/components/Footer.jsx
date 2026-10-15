import { ArrowRight, Building2, CheckCircle2, ChevronRight, Droplets, HardHat, Mail, MapPin, Menu, Phone, Paintbrush, ShieldCheck, Sparkles, Wrench, X, Zap, MessageCircle } from "lucide-react";

export default function Footer() { return (
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
); }
