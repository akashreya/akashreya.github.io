import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faGithub,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

/**
 * Reusable SocialLinks component
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.socialLinks - Social media links object
 * @param {string} props.socialLinks.github - GitHub URL
 * @param {string} props.socialLinks.linkedin - LinkedIn URL
 * @param {string} props.socialLinks.instagram - Instagram URL
 * @param {string} props.iconSize - FontAwesome icon size (default: "2x")
 * @returns {JSX.Element} SocialLinks component
 */
const SocialLinks = ({ className = "", socialLinks = {}, iconSize = "2x" }) => {
  const {
    github = "https://github.com/akashreya",
    linkedin = "https://www.linkedin.com/in/akash-kantharaj-68526a3a/",
    instagram = "https://www.instagram.com/akashreya",
  } = socialLinks;

  return (
    <div className={`socials-section ${className}`}>
      <ul>
        {github && (
          <li>
            <p>
              <a
                href={github}
                rel="noreferrer"
                target="_blank"
                aria-label="GitHub Profile"
              >
                <FontAwesomeIcon icon={faGithub} size={iconSize} />
              </a>
            </p>
          </li>
        )}
        {instagram && (
          <li>
            <p>
              <a
                href={instagram}
                rel="noreferrer"
                target="_blank"
                aria-label="Instagram Profile"
              >
                <FontAwesomeIcon icon={faInstagram} size={iconSize} />
              </a>
            </p>
          </li>
        )}
        {linkedin && (
          <li>
            <p>
              <a
                href={linkedin}
                rel="noreferrer"
                target="_blank"
                aria-label="LinkedIn Profile"
              >
                <FontAwesomeIcon icon={faLinkedin} size={iconSize} />
              </a>
            </p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default SocialLinks;
