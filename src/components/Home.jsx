import heroImg from "../assets/hero_img.png";
import { homePage, contact, about } from "../profile";
import { AnimatedText } from "./animated-text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SocialLinks from "./SocialLinks";
import { motion } from "framer-motion";
import { DotPattern } from "./utility/DotPattern";
import { cn } from "../utils/cn";

const Home = () => {
  return (
    <section id="home" className="hero">
      {/* Combined dot pattern with all corner effects */}
      <DotPattern
        glow={false}
        cr={2.5}
        className={cn(
          "[mask-image:radial-gradient(200px_circle_at_top_left,white,transparent_90%),radial-gradient(300px_circle_at_top_right,white,transparent_90%),radial-gradient(300px_circle_at_bottom_left,white,transparent_60%),radial-gradient(300px_circle_at_bottom_right,white,transparent_100%)]", // mobile
          "md:[mask-image:radial-gradient(400px_circle_at_top_left,white,transparent_100%),radial-gradient(600px_circle_at_top_right,white,transparent_80%),radial-gradient(600px_circle_at_bottom_left,white,transparent_80%),radial-gradient(400px_circle_at_bottom_right,white,transparent_90%)]" // md and up
        )}
      />

      <div className="hero-content">
        <div className="hero-item">
          <div className="hero-detail flex-1 min-w-0">
            <h1 className="hero-title">
              <span>
                My Self,
                <br />
                <span className="name">
                  <AnimatedText text={homePage.fullName} />
                </span>
              </span>
            </h1>
            <p className="hero-detail">{homePage.heroDetail}</p>
            <div className="hero-actions">
              {/* CTA mail to contact me */}
              <div className="cta-section">
                <a
                  href={`mailto:${contact.emailID}`}
                  className="cta-button"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon="envelope" />
                  <span>Get In Touch</span>
                </a>
              </div>
              <div className="inline-flex items-center text-sm md:text-xl ml-2">
                <FontAwesomeIcon
                  icon="map-marker"
                  className="mr-2 text-rose-500"
                />
                {homePage.location}
              </div>
              {/* Social media links */}
              <SocialLinks
                socialLinks={{
                  github: contact.githubURL,
                  linkedin: contact.linkedinURL,
                  instagram: "https://www.instagram.com/akashreya",
                }}
              />
            </div>
          </div>
          <div className="hero-img flex-1 min-w-0">
            <motion.div
              className="card shadow-lg bg-tertiary dark:bg-primary"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1.6,
                ease: "easeIn",
                visualDuration: 1.6,
              }}
            >
              <div className="card relative overflow-hidden">
                <img src={heroImg} alt="akash" />
              </div>
            </motion.div>
          </div>
          <div className="hero-name flex-1 min-w-0">
            <h3>
              I am a <br />
              <span>{homePage.heroTitle}</span>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
