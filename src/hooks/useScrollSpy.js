import { useState, useEffect } from "react";

const useScrollSpy = (sections) => {
  const [activeSection, setActiveSection] = useState("home");

  const handleScroll = () => {
    let closestSection = sections[0];
    let minOffset = Infinity;
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const offset = Math.abs(rect.top);
        if (offset < minOffset) {
          minOffset = offset;
          closestSection = id;
        }
      }
    });
    setActiveSection(closestSection);
  };

  const handleClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const onScroll = () => handleScroll();
    window.addEventListener("scroll", onScroll);
    handleScroll(); // Run once after initial render to sync with current scroll position
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  return { activeSection, handleClick };
};

export default useScrollSpy;
