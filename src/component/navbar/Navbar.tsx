import { Outlet, useNavigate } from "react-router-dom";
import { appTitle, navbarLinks } from "../../helpers/constants";
import "./Navbar.css";
import { useState } from "react";
import { IUser } from "../../helpers/interface";
import toast from "react-hot-toast";

interface NavbarProps {
  user: any;
  isLoggedIn: boolean;
  setUserState: (user: IUser | null) => void;
}

function Navbar({ isLoggedIn, setUserState, user }: NavbarProps) {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState<string>(
    navbarLinks[0]?.name || ""
  );

  const handleLogout = () => {
    setUserState(null);
    window.location.href = "/auth/login";
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  return (
    <div>
      <Outlet />

      <nav className="navbar">
        <div className="navbar__logo">
          {appTitle}
          <span className="navbar__powered-by">| Powered by Generative AI</span>
        </div>

        <ul className="navbar__links">
          {navbarLinks.map((link) => (
            <li
              key={link.name}
              className={
                activeLink === link.name
                  ? "active-navlink"
                  : "navbar__links github-link"
              }
              onClick={() => {
                if (link.name.toLowerCase() !== "github") {
                  setActiveLink(link.name);
                  navigate(link.path);
                }
                if (link.name.toLowerCase() === "home") {
                  if (isLoggedIn) {
                    navigate("/auth/login");
                  } else {
                    navigate("/");
                  }
                }
                if (link.name.toLowerCase() === "github") return;
              }}
            >
              {link.name}

              {link.name.toLowerCase() === "github" && (
                <div className="github-card">
                  <p className="github-card-title">Frontend Repo:</p>
                  <a
                    href="https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Frontend"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Frontend
                  </a>
                  <p className="github-card-title">Backend Repo:</p>
                  <a
                    href="https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Backend"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Backend
                  </a>
                </div>
              )}
            </li>
          ))}

          {isLoggedIn && user !== null && (
            <li
              className="navbar__logout"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              Logout
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
