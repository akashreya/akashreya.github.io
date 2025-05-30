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
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-80 flex-1 p-5 w-full">
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
