import React, { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import About from "./components/About";
import Skills from "./components/Skills";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import ToggleDarkMode from "./components/ToggleDarkMode";
import SectionDivider from "./components/SectionDivider";
import { library } from "@fortawesome/fontawesome-svg-core";

import {
  faEnvelope,
  faBriefcase,
  faCalendar,
  faGlobe,
  faMobile,
  faMapMarker,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faEnvelope,
  faBriefcase,
  faGlobe,
  faMobile,
  faMapMarker,
  faCalendar
);

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex">
        {!isOpen && (
          <button className="hamburger-button" onClick={() => setIsOpen(true)}>
            ☰
          </button>
        )}
        
        {/* Dark mode toggle in top right */}
        <div className="fixed top-4 right-4 z-50">
          <ToggleDarkMode />
        </div>
        
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="main-content">
          <Home />
          <SectionDivider />
          <About />
          <SectionDivider />
          <Portfolio />
          <SectionDivider />
          <Skills />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
