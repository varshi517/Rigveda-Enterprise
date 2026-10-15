import { ArrowRight, Building2, CheckCircle2, ChevronRight, Droplets, HardHat, Mail, MapPin, Menu, Phone, Paintbrush, ShieldCheck, Sparkles, Wrench, X, Zap, MessageCircle } from "lucide-react";

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

export default function Services() { return (
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
); }
