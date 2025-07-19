import HighlightSection from "./HighlightSection";
import Project from "./Project";
import axiosInstance from "../api/axios";
import { projectDetails } from "../profile";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const filters = ["all", "backend", "frontend", "fullstack"];

  useEffect(() => {
    const fetchProjects = async () => {
      // Debug: Log environment info
      console.log("Environment:", {
        isDev: import.meta.env.DEV,
        mode: import.meta.env.MODE,
        base: import.meta.env.BASE_URL,
        apiUrl: import.meta.env.VITE_API_URL,
      });

      try {
        // Always try API call first (both dev and production)
        console.log("Trying API call to:", import.meta.env.VITE_API_URL);
        const response = await axiosInstance.get("/api/projects", {
          withCredentials: false,
        });
        console.log("✅ API call successful, using live data");
        setProjects(response.data);
      } catch (error) {
        console.error("❌ API call failed, using backup data:", error.message);
        // Fallback to static data if API fails
        setProjects(projectDetails.projects);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filterProjects = (element) => {
    const type = element.target.getAttribute("data-filter");
    setSelectedFilter(type.toLowerCase());
  };

  const filteredProjects =
    selectedFilter === "all"
      ? projects
      : projects.filter(
          (project) => project.projectType.toLowerCase() === selectedFilter
        );

  // if (loading && projects.length == 0) {
  //   return <p>Loading projects...</p>;
  // }

  return (
    <section id="portfolio" className="component">
      <HighlightSection
        text={projectDetails.title}
        highlights={projectDetails.titleHighlight}
      />
      <div className="projects-outer">
        <div className="projects-react-tabs">
          <div className="portfolio-tabs">
            <ul>
              {filters.map((type) => (
                <li
                  key={type}
                  data-filter={type}
                  onClick={filterProjects}
                  className={`${
                    selectedFilter === type
                      ? "scale-120 font-extraboldbold text-rose-500"
                      : "font-normal "
                  }`}
                >
                  {type.charAt(0).toUpperCase() +
                    type.slice(1).replace("-", " ")}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div key={selectedFilter} className="projects-list-inner">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.5,
                  scale: { type: "spring", visualDuration: 0.8, bounce: 0.1 },
                }}
              >
                <Project
                  project={project}
                  onFilterSelect={(type) => setSelectedFilter(type)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredProjects.length === 0 && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="no-projects"
            >
              No projects found.
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
