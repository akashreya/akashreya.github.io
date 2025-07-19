import HighlightSection from "./HighlightSection";
import { contact } from "../profile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SocialLinks from "./SocialLinks";

const Contact = () => (
  <section id="contact" className="component">
    <HighlightSection
      text={contact.title}
      highlights={contact.titleHighlight}
    />

    <div className="contact-me-content">
      <div className="contact-socials">
        <div>
          <div className="contact-box">
            <div className="contact-detail">
              <div className="contact-icon">
                <div className="text">
                  <FontAwesomeIcon icon="envelope" />
                </div>
              </div>
              <div className="contact-info">
                <h3 className="contact-title">E-Mail</h3>
                <p>
                  <FontAwesomeIcon icon="envelope" /> &nbsp;
                  akashakashreya@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="contact-box">
            <div className="contact-detail">
              <div className="contact-icon">
                <div className="text">
                  <FontAwesomeIcon icon="mobile" />
                </div>
              </div>
              <div className="contact-info">
                <h3 className="contact-title">Contact</h3>
                <p>
                  <FontAwesomeIcon icon="mobile" /> &nbsp; (+91)-7411897518
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="contact-box">
            <div className="contact-detail">
              <div className="contact-icon">
                <div className="text">
                  <FontAwesomeIcon icon="globe" />
                </div>
              </div>
              <div className="contact-info">
                <h3 className="contact-title">Social</h3>
                <SocialLinks
                  socialLinks={{
                    github: contact.githubURL,
                    linkedin: contact.linkedinURL,
                    instagram: "https://www.instagram.com/akashreya",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contact-form ">
        <form className="">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="fname"
              placeholder="Full Name"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="phone"
              placeholder="Phone"
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-control"
              id="textAreaMessage"
              rows="4"
              placeholder="Message"
            />
          </div>
          <button type="submit" className="learn-more-right">
            <span className="text">Submit</span>
          </button>
        </form>
      </div>
    </div>
  </section>
);

export default Contact;
