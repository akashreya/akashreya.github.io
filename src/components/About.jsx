import { about } from "../profile";
import HighlightSection from "./HighlightSection";
const About = () => (
  <section id="about" className="component w-full">
    <div className="container">
      <div className="row">
        <HighlightSection
          text={about.title}
          highlights={about.titleHighlight}
        />

        <div className="about-details">
          <div className="about-detail">
            <h4>{about.aboutHeading}</h4>
            <p className="about-text indent-20 mt-5">{about.textOne}</p>
            <p className="about-text">{about.textTwo}</p>
            <p className="about-text">{about.textThree}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
