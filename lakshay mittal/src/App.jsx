import ModelViewer from "./ModelViewer";
import Navbar from "./components/navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faGithub,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import "./App.css";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <div className="container">
        <div className="intro-text">
          <h1 className="hero-title">Hi there 👋</h1>
          <h1>
            I'm <span className="gradient-text">Lakshay Mittal</span>
          </h1>
          <p>
            I'm a full-stack web developer with a passion for creating highly
            interactive web experiences.
          </p>
          <div className="socialsContainer">
            <FontAwesomeIcon size="2x" icon={faEnvelope} />
            <FontAwesomeIcon size="2x" icon={faLinkedin} />
            <FontAwesomeIcon size="2x" icon={faGithub} />
            <FontAwesomeIcon size="2x" icon={faTwitter} />
          </div>
        </div>
        <ModelViewer className="model" />
      </div>
    </>
  );
}

export default App;
