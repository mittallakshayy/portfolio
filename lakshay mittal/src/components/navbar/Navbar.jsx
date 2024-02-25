import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navName">
        <div className="logo-text">Lakshay Mital</div>
      </div>

      <button>About</button>
      <button>Blog</button>
      <button>Resume</button>
      <button>Projects</button>
      <button>Contact</button>
    </nav>
  );
}

export default Navbar;
