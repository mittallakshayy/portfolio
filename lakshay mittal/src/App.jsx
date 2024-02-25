import Profile from "./assets/sketch.svg";
import "./App.css";
import Navbar from "./components/navbar/Navbar";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <div className="container">
        <div className="heading">
          <h1>Lakshay Mittal</h1>
          <div className="profession">
            Software Engineer | Full Stack Web Developer
          </div>
        </div>
        <div className="image">
          <img className="sketch" src={Profile}></img>
        </div>
      </div>
    </>
  );
}

export default App;
