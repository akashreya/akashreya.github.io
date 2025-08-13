import { about, experience } from "../profile";
import { Timeline } from "./utility/Timeline";
import { TimelineItem } from "./utility/TimelineItem";
import HighlightSection from "./HighlightSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AnimatedSection from "./utility/AnimatedSection";

const About = () => (
  <section id="about" className="component">
    <AnimatedSection variant="fadeUp" delay={0.2}>
      <HighlightSection text={about.title} highlights={about.titleHighlight} />
    </AnimatedSection>
    
    <AnimatedSection variant="fadeUp" delay={0.4} className="about-details">
      <AnimatedSection variant="slideLeft" delay={0.6} className="experience-timeline">
        <Timeline layout="2-columns">
          {experience.map((exp, idx) => (
            <TimelineItem
              className="rounded-4xl
               bg-gradient-to-t from-secondary via-primary to-secondary
               dark:from-white/30 dark:via-black/30 dark:to-white/30
               border border-tertiary dark:border-primary
               text-tertiary dark:text-primary 
               shadow-md shadow-tertiary dark:shadow-primary"
              key={exp.firm.name + exp.date}
              firm={
                <span className="inline-flex items-center gap-2">
                  <img
                    src={exp.firm.logo}
                    alt={exp.firm.name + " logo"}
                    className="w-fit h-10 object-contain"
                  />
                  {exp.firm.name}
                </span>
              }
              position={exp.postion}
              location={exp.location}
              date={exp.date}
              color={idx === 0 ? "bg-green-500" : "bg-blue-500"}
              icon={
                <FontAwesomeIcon icon="briefcase" className="text-secondary" />
              }
            >
              {Array.isArray(exp.details) && exp.details.length > 0 ? (
                <ul className="list-disc ml-5">
                  {exp.details.filter(Boolean).map((d, i) => (
                    <li className="ml-2 text-xs md:text-xl" key={i}>
                      {d}
                    </li>
                  ))}
                </ul>
              ) : null}
            </TimelineItem>
          ))}
        </Timeline>
      </AnimatedSection>
      
      <AnimatedSection variant="slideRight" delay={0.8} className="about-detail">
        <p className="about-text indent-20 mt-5">{about.textOne}</p>
        <br />
        <p className="about-text">{about.textTwo}</p>
        <br />
        <p className="about-text">{about.textThree}</p>
      </AnimatedSection>
    </AnimatedSection>
  </section>
);

export default About;
