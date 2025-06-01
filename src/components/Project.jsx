import { useEffect, useState, useRef } from "react";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import heroImg from "../assets/hero_img.png";
import { AnimatePresence, motion } from "motion/react";

const Project = ({ project, onFilterSelect }) => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();
  useEffect(() => {
    Fancybox.bind('[data-fancybox="gallery"]', {
      // optional settings
    });
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };

    if (showModal) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  return (
    <div>
      <div className="project-box group">
        <h3>{project.title} </h3>
        <div className="links">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onFilterSelect(project.type.toLowerCase());
            }}
          >
            {project.type}
          </a>
        </div>
        <p>{project.shortDescription}</p>
        <a className="links" onClick={() => setShowModal(true)}>
          Read more
        </a>
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="project-modal-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                ref={modalRef}
                className="project-modal"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <button onClick={() => setShowModal(false)}>Close</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="project-info">
          <div className="portfolio-img">
            <a
              data-fancybox="gallery"
              data-src={heroImg}
              href={heroImg}
              className='bg-[url("akash.png")]'
            >
              <span className="overlay">+</span>
            </a>
            <div />
          </div>
          <div className="project-detail">
            <ul>
              <li>Date : 1, Jan - 2023</li>
              <li>Client : Symphony</li>
              <li>Tech : Angular, Nodejs, Ios</li>
              <li>Type : eCommerce</li>
              <li>
                URL : <a href="/">{project.liveDemoUrl}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Project;
