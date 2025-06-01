const HighlightText = ({ text, highlights }) => {
  const regex = new RegExp(`(${highlights.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <h2>
      {parts.map((part, index) =>
        highlights.some((word) => word.toLowerCase() === part.toLowerCase()) ? (
          <span key={index}>{part}</span>
        ) : (
          part
        )
      )}
    </h2>
  );
};

const HighlightSection = ({ text, highlights }) => {
  return (
    <div className="section-heading">
      <HighlightText text={text} highlights={highlights} />
    </div>
  );
};

export default HighlightSection;
