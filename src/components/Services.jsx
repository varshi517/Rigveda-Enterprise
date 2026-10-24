
import {
  Building2,
  Droplets,
  ShieldCheck,
  Wrench,
  Zap,
  Activity,
} from "lucide-react";

const services = [
  {
    number: "01",
    title: "Electrical Projects",
    description:
      "Electrical project works and related technical services.",
    icon: Zap,
    color: "electrical",
  },
  {
    number: "02",
    title: "HVAC",
    description:
      "Heating, ventilation and air-conditioning project works.",
    icon: Droplets,
    color: "hvac",
  },
  {
    number: "03",
    title: "Mechanical",
    description:
      "Mechanical project works and technical support.",
    icon: Wrench,
    color: "mechanical",
  },
  {
    number: "04",
    title: "Civil Works",
    description:
      "Civil works and project-related services.",
    icon: Building2,
    color: "civil",
  },
  {
    number: "05",
    title: "Fire & CCTV",
    description:
      "Fire and CCTV project works.",
    icon: ShieldCheck,
    color: "fire",
  },
  {
    number: "06",
    title: "AMC & Breaker Maintenance",
    description:
      "Annual maintenance contracts and breaker maintenance.",
    icon: Wrench,
    color: "maintenance",
  },
  {
    number: "07",
    title: "Relay Testing",
    description:
      "Relay testing services for technical maintenance requirements.",
    icon: Activity,
    color: "relay",
  },
  {
    number: "08",
    title: "Calibration & Troubleshooting",
    description:
      "Calibration and troubleshooting services.",
    icon: Activity,
    color: "calibration",
  },
];

export default function Services() {
  return (
    <section id="services" className="services-section">
      <div className="services-heading">
        <div>
          <span className="section-tag">OUR SERVICES</span>

          <h2>
            Project expertise.
            <br />
            <em>Technical support.</em>
          </h2>
        </div>

        <p>
          Rigveda Enterprises provides project works across electrical,
          HVAC, mechanical, civil, fire and CCTV disciplines, along with
          AMC, breaker maintenance, relay testing, calibration and
          troubleshooting.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <article
              className={`service-card service-${service.color}`}
              key={service.number}
            >
              <div className="service-top">
                <span className="service-number">
                  {service.number}
                </span>

                <div className="service-icon" aria-hidden="true">
                  <Icon size={25} strokeWidth={1.8} />
                </div>
              </div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
