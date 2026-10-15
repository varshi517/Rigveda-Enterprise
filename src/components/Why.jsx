import { ArrowRight, Building2, CheckCircle2, ChevronRight, Droplets, HardHat, Mail, MapPin, Menu, Phone, Paintbrush, ShieldCheck, Sparkles, Wrench, X, Zap, MessageCircle } from "lucide-react";

export default function Why() {
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
); }
