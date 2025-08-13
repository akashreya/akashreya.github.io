const Skill = ({ skill }) => {
  const { imageURL, name, category } = skill;
  
  // Generate category-based class name for color mapping
  const categoryClass = category.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`skill skill-${categoryClass}`}>
      <div className="skill-icon-container w-12 h-12 flex items-center justify-center mr-4 rounded-4xl">
        <img src={imageURL} alt={name} className="skill-icon w-8 h-8 object-contain" />
      </div>
      <div className="skill-content flex flex-col flex-1 items-start p-2 rounded-2xl bg-white/20 dark:bg-black/20">
        <div className="skill-name text-tertiary dark:text-primary font-bold text-sm md:text-2xl">
          {name}
        </div>
        <div className="skill-category text-tertiary dark:text-primary text-xs md:text-lg">
          {category}
        </div>
      </div>
    </div>
  );
};

export default Skill;
