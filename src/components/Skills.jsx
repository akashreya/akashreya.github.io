import Skill from "./Skill";
import { skillDetails } from "../profile";
import HighlightSection from "./HighlightSection";

const Skills = () => {
  // Group skills by category
  const groupedSkills = skillDetails.expertise.reduce((acc, skill) => {
    const { category } = skill;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="component">
      <HighlightSection
        text={skillDetails.title}
        highlights={skillDetails.titleHighlight}
      />
      <div className="mt-10 m-4 grid grid-cols-1 md:flex md:flex-wrap justify-center">
        {Object.entries(groupedSkills).map(([category, skills]) => (
          <div
            key={category}
            className="grid grid-cols-1 md:inline-flex md:flex-wrap 
            m-2 rounded-2xl bg-white/30 p-2 
            shadow-sm shadow-tertiary dark:shadow-secondary backdrop-blur"
          >
            {skills.map((skill) => (
              <Skill key={skill.name} skill={skill} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
