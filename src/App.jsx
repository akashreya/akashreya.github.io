import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import About from "./components/About";
import Skills from "./components/Skills";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEnvelope,
  faGlobe,
  faMobile,
  faMapMarker,
} from "@fortawesome/free-solid-svg-icons";

library.add(faEnvelope, faGlobe, faMobile, faMapMarker);

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex">
      {!isOpen && (
        <button className="hamburger-button" onClick={() => setIsOpen(true)}>
          ☰
        </button>
      )}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="main-content">
        <Home />
        <About />
        <Skills />
        <Portfolio />
        <Contact />
      </div>
    </div>
  );
};

export default App;
