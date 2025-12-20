import { Outlet, useNavigate } from "react-router-dom";
import { meditationTitle, navbarLinks } from "../../helpers/constants";
import "./Navbar.css";
import { useState } from "react";
import { IUser } from "../../helpers/interface";
import toast from "react-hot-toast";

interface NavbarProps {
  user: any;
  isLoggedIn: boolean;
  setUserState: (user: IUser | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

function Navbar({
  isLoggedIn,
  setUserState,
  user,
  setIsLoggedIn,
}: NavbarProps) {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState<string>(
    navbarLinks[0]?.name || ""
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const [githubOpen, setGithubOpen] = useState(false);

  const handleLogout = () => {
    setUserState(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    setIsLoggedIn(false);
    navigate("/auth/login");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar__logo" onClick={() => navigate("/")}>
          {meditationTitle}
          <span className="navbar__powered-by">| Powered by Generative AI</span>
        </div>

        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>

        <ul className={`navbar__links ${menuOpen ? "open" : ""}`}>
          {navbarLinks.map((link) => {
            const isGithub = link.name.toLowerCase() === "github";

            return (
              <li
                key={link.name}
                className={`
          ${activeLink === link.name ? "active-navlink" : ""}
          ${isGithub ? "github-link" : ""}
          ${isGithub && githubOpen ? "github-link-open" : ""}
        `}
                onClick={() => {
                  if (isGithub) {
                    setGithubOpen((prev: boolean) => !prev);
                    setActiveLink(link.name);
                    return;
                  }

                  setGithubOpen(false);

                  setActiveLink(link.name);
                  setMenuOpen(false);

                  if (link.name.toLowerCase() === "home") {
                    navigate(isLoggedIn ? "/auth/login" : "/");
                  } else {
                    navigate(link.path);
                  }
                }}
              >
                {link.name}

                {isGithub && (
                  <div className="github-card">
                    <p className="github-card-title">Frontend Repo:</p>
                    <a
                      // href="https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Frontend"
                      href="https://github.com/vini1237777"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Frontend
                    </a>
                    <p className="github-card-title">Backend Repo:</p>
                    <a
                      // href="https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Backend"
                      href="https://github.com/vini1237777"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Backend
                    </a>
                  </div>
                )}
              </li>
            );
          })}

          {isLoggedIn && user !== null && (
            <li
              className="navbar__logout"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
                setGithubOpen(false);
              }}
            >
              Logout
            </li>
          )}
        </ul>
      </nav>

      <Outlet />
    </div>
  );
}

export default Navbar;
