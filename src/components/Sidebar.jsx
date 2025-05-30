import { useEffect } from "react";
import { useState } from "react";
import useScrollSpy from "../hooks/useScrollSpy";
import ToggleDarkMode from "./ToggleDarkMode";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const sections = ["home", "about", "skills", "portfolio", "contact"];
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
      className={`fixed top-0 left-0 h-screen w-90 p-6 bg-slate-900 text-red-50 ${
        isOpen ? "block" : "hidden"
      } lg:block flex flex-col justify-between`}
    >
      <div className="flex items-center">
        <div className="flex flex-col space-y-25 top-1/5 left-4">
          {sections.map((section) => (
            <div
              key={section}
              onClick={() => handleClick(section)}
              className={`transition-all duration-300 cursor-pointer flex items-center text-4xl ${
                activeSection === section
                  ? "w-10 h-5 rounded-full bg-indigo-600"
                  : "w-4 h-4 rounded-full bg-gray-400"
              }`}
            >
              <a
                className={`ml-16 hover:text-violet-500 transtion-all duration-200 ${
                  activeSection === section ? "text-rose-500 text-5xl " : ""
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Hamburger for mobile */}
      <button
        className="lg:hidden absolute top-5 left-5"
        onClick={toggleSidebar}
      >
        ☰
      </button>
      <div className="absolute bottom-2 left-2">
        <ToggleDarkMode />
      </div>
    </aside>
  );
};

export default Sidebar;
