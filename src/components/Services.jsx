
import {
  ArrowUpRight,
  Building2,
  Droplets,
  HardHat,
  Paintbrush,
  Wrench,
  Zap,
} from "lucide-react";

const services = [
  {
    number: "01",
    title: "Mechanical",
    description:
      "Mechanical installation, equipment maintenance, and technical support for dependable facility operations.",
    icon: Wrench,
  },
  {
    number: "02",
    title: "Electrical",
    description:
      "Electrical installations, system maintenance, and reliability-focused support with safety in mind.",
    icon: Zap,
  },
  {
    number: "03",
    title: "Plumbing",
    description:
      "Plumbing installation, repairs, and preventive maintenance to keep essential building systems running.",
    icon: Droplets,
  },
  {
    number: "04",
    title: "Facility Management",
    description:
      "Coordinated facility support and maintenance to help keep buildings functional, efficient, and well maintained.",
    icon: Building2,
  },
  {
    number: "05",
    title: "Painting & Civil",
    description:
      "Painting, renovation, civil repairs, and improvement works for commercial and industrial spaces.",
    icon: Paintbrush,
  },
  {
    number: "06",
    title: "Road & Infrastructure",
    description:
      "Infrastructure and road-related works, site support, and practical project execution.",
    icon: HardHat,
  },
];

export default function Services() {
  return (
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
          infrastructure, and maintenance, we bring practical
          solutions together under one roof.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <a
              className="service-card"
              key={service.number}
              href={`/?service=${encodeURIComponent(
                service.title
              )}#contact`}
              aria-label={`Enquire about ${service.title}`}
            >
              <div className="service-top">
                <span className="service-number">
                  {service.number}
                </span>

                <div className="service-icon">
                  <Icon size={25} strokeWidth={1.8} />
                </div>
              </div>

              <h3>{service.title}</h3>
              <p>{service.description}</p>

              <div className="service-card-footer">
                <span>Discuss this service</span>
                <span className="service-arrow" aria-hidden="true">
                  <ArrowUpRight size={20} />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
