import { about } from "../profile";
import HighlightSection from "./HighlightSection";
const About = () => (
  <section id="about" className="component">
    <HighlightSection text={about.title} highlights={about.titleHighlight} />
    <div className="about-details">
      <div className="about-detail">
        <h4>{about.aboutHeading}</h4>
        <br />
        <p className="about-text indent-20 mt-5">{about.textOne}</p>
        <br />
        <p className="about-text">{about.textTwo}</p>
        <br />
        <p className="about-text">{about.textThree}</p>
      </div>
    </div>
  </section>
);

export default About;
