import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import heroImg from "../assets/hero_img.png";
import { AnimatePresence, motion } from "motion/react";
import { BorderBeam } from "./utility/border-beam";

const Project = ({ project, onFilterSelect }) => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();
  useEffect(() => {
    Fancybox.bind('[data-fancybox^="gallery-"]', {});
    return () => {
      Fancybox.unbind('[data-fancybox^="gallery-"]');
    };
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
        <BorderBeam
          size={300}
          duration={7}
          delay={project.id * 10}
          borderWidth={3}
          className="dark:bg-secondary bg-tertiary"
        />
        <h3>{project.title} </h3>
        <div className="links">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onFilterSelect(project.projectType.toLowerCase());
            }}
          >
            {project.projectType}
          </a>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xs md:text-sm 2xl:text-2xl">
            {project.shortDescription}
            {project.description && project.description.length > 0 && (
              <a
                className="links cursor-pointer rounded-full my-1 
                bg-gradient-to-r from-amber-700 to-orange-800 
                dark:from-purple-600 dark:to-pink-600 
                hover:from-amber-800 hover:to-orange-900
                dark:hover:from-purple-700 dark:hover:to-pink-700
                px-3 py-1.5 text-white font-medium
                text-xs md:text-sm 2xl:text-xl
                ml-2 align-middle shadow-md hover:shadow-lg
                transition-all duration-300 hover:scale-105
                inline-flex items-center justify-center
                min-w-[25px] min-h-[25px]"
                onClick={() => setShowModal(true)}
              >
                Read more
              </a>
            )}
          </p>
        </div>

        {showModal && createPortal(
          <AnimatePresence>
            <motion.div
              className="project-modal-bg"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                ref={modalRef}
                className="project-modal"
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.2, opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3>{project.title}</h3>
                <section
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
                <button onClick={() => setShowModal(false)}>Close</button>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
        <div className="project-info">
          {project.images && project.images.length > 0 && (
            <div className="portfolio-img relative">
              {/* Show the thumbnail or primary image */}
              {(() => {
                // Find the thumbnail or primary image
                const thumb =
                  project.images.find((img) => img.role === "THUMBNAIL") ||
                  project.images.find((img) => img.role === "PRIMARY") ||
                  project.images[0];
                return (
                  <a
                    data-fancybox={`gallery-${project.id}`}
                    href={thumb.imageKey}
                    className="relative block"
                  >
                    <div className="relative inline-block">
                      <img src={thumb.imageKey} alt={project.title} />
                      <span
                        className="overlay absolute inset-0 rounded-3xl flex items-center justify-center 
                      text-xs xl:text-4xl text-white bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity 
                      duration-300 pointer-events-none"
                      >
                        +
                      </span>
                    </div>
                  </a>
                );
              })()}

              {/* Hidden gallery images */}
              {project.images
                .filter(
                  (img) => img.role === "GALLERY" || img.role === "PRIMARY"
                )
                .map((img, idx) => (
                  <a
                    key={img.imageKey}
                    data-fancybox={`gallery-${project.id}`}
                    data-src={img.imageKey}
                    style={{ display: "none" }}
                  />
                ))}
            </div>
          )}
          <div className="project-detail">
            <ul>
              {project.technologies && project.technologies.length > 0 && (
                <li className="text-xs md:text-sm 2xl:text-xl">
                  Tech : {project.technologies.map((t) => t.name).join(", ")}
                </li>
              )}

              <li>
                <div className="flex items-left lg:items-center flex-col lg:flex-row gap-4 w-fit">
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-3 py-2
                    text-xs md:text-sm 2xl:text-xl
                       bg-gradient-to-r from-amber-700 to-orange-800
                       dark:from-purple-600 dark:to-pink-600
                       hover:from-amber-800 hover:to-orange-900
                       dark:hover:from-purple-700 dark:hover:to-pink-700
                        text-white font-medium
                        rounded-lg shadow-md hover:shadow-lg 
                        transition-all duration-300 hover:scale-105
                        min-w-[25px] min-h-[25px]"
                    >
                      Website
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-3 py-2
                      text-xs md:text-sm 2xl:text-xl
                       bg-gradient-to-r from-stone-700 to-amber-800
                       dark:from-indigo-600 dark:to-purple-600
                       hover:from-stone-800 hover:to-amber-900
                       dark:hover:from-indigo-700 dark:hover:to-purple-700
                        text-white font-medium
                        rounded-lg shadow-md hover:shadow-lg 
                        transition-all duration-300 hover:scale-105
                        min-w-[25px] min-h-[25px]"
                    >
                      Code
                    </a>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Project;
