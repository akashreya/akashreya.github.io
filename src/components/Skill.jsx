const Skill = ({ imageURL, label }) => {
  return (
    <div className="skill">
      <div className="skill">
        <img src={imageURL} alt="akash" />
      </div>
      <br />
      <h6>{label}</h6>
    </div>
  );
};

export default Skill;
