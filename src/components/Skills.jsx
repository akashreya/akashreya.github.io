import Skill from "./Skill";
import { skillDetails } from "../profile";
import HighlightSection from "./HighlightSection";
import AnimatedSection from "./utility/AnimatedSection";
import StaggerItem from "./utility/StaggerItem";

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
      <AnimatedSection variant="fadeUp" delay={0.2}>
        <HighlightSection
          text={skillDetails.title}
          highlights={skillDetails.titleHighlight}
        />
      </AnimatedSection>
      
      <AnimatedSection 
        stagger={true} 
        delay={0.4} 
        className="mt-8 mx-4 grid grid-cols-1 lg:grid-cols-2 xl:flex xl:flex-wrap justify-center gap-6 md:gap-8"
      >
        {Object.entries(groupedSkills).map(([category, skills]) => (
          <StaggerItem
            key={category}
            className="flex flex-col items-center"
          >
            {/* Category Header */}
            <div className="mb-4 text-center">
              <h3 className="text-lg md:text-2xl lg:text-3xl font-bold
                         bg-gradient-to-r from-amber-700 to-orange-800 
                         dark:from-purple-500 dark:to-pink-500 
                         bg-clip-text text-transparent
                         tracking-tight px-4 py-2 rounded-xl
                         shadow-sm">
                {category}
              </h3>
            </div>
            
            {/* Skills Container */}
            <div className="grid grid-cols-1 xl:inline-flex xl:flex-wrap 
                          rounded-3xl bg-white/20 dark:bg-white/5 p-3 md:p-4 
                          shadow-lg shadow-tertiary/20 dark:shadow-secondary/30 
                          backdrop-blur-md backdrop-saturate-150
                          border border-white/30 dark:border-white/10
                          hover:border-amber-300/50 dark:hover:border-purple-400/30
                          hover:bg-white/25 dark:hover:bg-white/10
                          transition-all duration-300">
              {skills.map((skill) => (
                <Skill key={skill.name} skill={skill} />
              ))}
            </div>
          </StaggerItem>
        ))}
      </AnimatedSection>
    </section>
  );
};

export default Skills;
