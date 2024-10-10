import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navName">
        <div className="logo-text">Lakshay Mittal</div>
      </div>

      <button>About</button>
      <button>Experience</button>
      <button>Projects</button>
      <button>Resume</button>
      <button>Contact</button>
    </nav>
  );
}

export default Navbar;
