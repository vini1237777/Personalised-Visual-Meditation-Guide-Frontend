import { Outlet, useNavigate } from "react-router-dom";
import { appTitle, navbarLinks } from "../../helpers/constants";
import "./Navbar.css";
import { useState } from "react";
import { IUser } from "../../helpers/interface";

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
    navigate("/");
  };

  return (
    <div>
      <Outlet />

      <nav className="navbar">
        <div className="navbar__logo">{appTitle}</div>
        <ul className="navbar__links">
          {navbarLinks.map((link) => (
            <li
              key={link.name}
              className={
                activeLink === link.name ? "active-navlink" : "navbar__links"
              }
              onClick={() => {
                setActiveLink(link.name);
                navigate(link.path);
              }}
            >
              {link.name}
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
