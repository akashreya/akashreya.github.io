import { useEffect } from "react";
import useScrollSpy from "../hooks/useScrollSpy";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const sections = ["home", "about", "portfolio", "skills"];
  const { activeSection, handleClick } = useScrollSpy(sections);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const [navigationEntry] = performance.getEntriesByType("navigation");

    if (navigationEntry && navigationEntry.type === "reload") {
      console.log("Page was reloaded, maintaining scroll position.");
    } else {
      console.log("First visit or navigation, scrolling to top.");
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Optional, for smooth scrolling
      });
    }
  }, []);

  return (
    <aside
      className={`sidebar  ${
        isOpen ? "block w-45 md:w-1/3 xl:w-80" : "hidden w-0"
      }  md:w-3/10 xl:w-90 md:p-4 lg:p-8`}
    >
      <div className="sidebar-content-outer">
        <div className="sidebar-content-inner">
          {sections.map((section) => (
            <div
              key={section}
              onClick={() => {
                handleClick(section);
                setIsOpen(false);
              }}
              className={`sidebar-section-bullet ${
                activeSection === section
                  ? "w-8 md:w-10 h-5 rounded-full bg-gradient-to-r from-amber-700 to-orange-800 dark:from-purple-600 dark:to-pink-600 shadow-lg shadow-amber-700/30 dark:shadow-purple-500/30"
                  : "w-4 h-4 rounded-full bg-gray-400 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-700 dark:hover:from-purple-400 dark:hover:to-pink-400 transition-all duration-300"
              }`}
            >
              <a
                className={`${
                  activeSection === section
                    ? "bg-gradient-to-r from-amber-700 to-orange-800 dark:from-pink-500 dark:to-purple-600 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold"
                    : "text-base md:text-lg lg:text-xl xl:text-2xl hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-700 dark:hover:from-pink-400 dark:hover:to-purple-500 hover:bg-clip-text hover:text-transparent transition-all duration-300"
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Close button*/}
      {isOpen && (
        <button className="sidebar-close-button" onClick={toggleSidebar}>
          ✕
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
