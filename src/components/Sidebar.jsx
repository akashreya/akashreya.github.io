import { useEffect } from "react";
import useScrollSpy from "../hooks/useScrollSpy";
import ToggleDarkMode from "./ToggleDarkMode";

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
      <div className="sidebar-darkmode">
        <ToggleDarkMode />
      </div>
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
                  ? "w-8 md:w-10 h-5 rounded-full bg-indigo-600"
                  : "w-4 h-4 rounded-full bg-gray-400"
              }`}
            >
              <a
                className={`${
                  activeSection === section
                    ? "text-rose-500 text-2xl md:text-3xl lg:text-5xl "
                    : ""
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
