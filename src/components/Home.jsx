import heroImg from "../assets/hero_img.png";
import { homePage } from "../profile";

const Home = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="hero-item static">
          <div className="hero-detail">
            <h1 className="hero-title">
              <span>
                My Self,
                <br />
                <span className="name">{homePage.fullName}</span>
              </span>
            </h1>
            <p className="hero-detail">{homePage.heroDetail}</p>
          </div>
          <div className="hero-img">
            <div className="card ">
              <div className="card">
                <img src={heroImg} alt="akash" />
              </div>
            </div>
          </div>
          <div className="hero-name">
            <h3>
              I am a <br />
              <span>{homePage.heroTitle}</span>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
