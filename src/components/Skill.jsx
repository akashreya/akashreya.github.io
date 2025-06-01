const Skill = ({ imageURL, label }) => {
  return (
    <div className="skill">
      <div>
        <img src={imageURL} alt="akash" />
      </div>
      <br />
      <h6>{label}</h6>
    </div>
  );
};

export default Skill;
