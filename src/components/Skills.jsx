import Skill from "./Skill";
import { skillDetails } from "../profile";
import HighlightSection from "./HighlightSection";

const Skills = () => (
  <section id="skills" className="component">
    <HighlightSection
      text={skillDetails.title}
      highlights={skillDetails.titleHighlight}
    />
    <div className="skills-bar">
      {skillDetails.expertise.map((skill) => (
        <Skill key={skill.name} imageURL={skill.imageURL} label={skill.name} />
      ))}
    </div>
  </section>
);

export default Skills;
