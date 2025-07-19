const Skill = ({ skill }) => {
  const { imageURL, name, category } = skill;
  return (
    <div className="skill">
      <div className="w-12 h-12 flex items-center justify-center mr-4 rounded-4xl">
        <img src={imageURL} alt={name} className="w-8 h-8 object-contain" />
      </div>
      <div className="flex flex-col flex-1 items-start p-2 rounded-2xl bg-white/20 dark:bg-black/20">
        <div className="text-tertiary dark:text-primary font-bold text-lg">
          {name}
        </div>
        <div className="text-tertiary dark:text-primary text-xs">
          {category}
        </div>
      </div>
    </div>
  );
};

export default Skill;
