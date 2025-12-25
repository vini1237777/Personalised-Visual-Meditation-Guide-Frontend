import { NavLink, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "../../../app/providers/AuthProvider";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, setUser } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [githubOpen, setGithubOpen] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const githubWrapRef = useRef<HTMLDivElement | null>(null);

  const showHome = isLoggedIn;

  const handleLogout = () => {
    setUser(null);
    toast.success("Logged out");
    navigate("/auth/login");
  };

  const closeAll = () => {
    setMenuOpen(false);
    setGithubOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!headerRef.current) return;
      if (!headerRef.current.contains(t)) closeAll();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!githubWrapRef.current) return;
      if (!githubWrapRef.current.contains(t)) setGithubOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onNavClick = () => closeAll();

  const GithubTrigger = (
    <div ref={githubWrapRef} className={styles.githubWrap}>
      <NavLink
        to="#"
        className={() =>
          githubOpen ? `${styles.link} ${styles.active}` : styles.link
        }
        onClick={(e) => {
          e.preventDefault();
          setGithubOpen((v) => !v);
        }}
      >
        Github
      </NavLink>

      <div
        className={`${styles.githubCard} ${
          githubOpen ? styles.githubCardOpen : ""
        }`}
      >
        <div className={styles.githubSection}>
          <p className={styles.githubTitle}>Frontend Repo</p>
          <a
            className={styles.githubItem}
            href="https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Frontend"
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Frontend
          </a>
        </div>

        <div className={styles.githubDivider} />

        <div className={styles.githubSection}>
          <p className={styles.githubTitle}>Backend Repo</p>
          <a
            className={styles.githubItem}
            href="https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Backend"
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Backend
          </a>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (!isLoggedIn && window.location.pathname === "/") {
      navigate("/auth/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <header ref={headerRef} className={styles.header}>
        <div className={styles.container}>
          <NavLink
            to={isLoggedIn ? "/" : "/auth/login"}
            className={styles.brand}
            onClick={onNavClick}
          >
            SoulSync
          </NavLink>

          <nav className={styles.nav}>
            {showHome && (
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
                end
                onClick={onNavClick}
              >
                Home
              </NavLink>
            )}

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              onClick={onNavClick}
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              onClick={onNavClick}
            >
              Contact
            </NavLink>

            {GithubTrigger}

            {!isLoggedIn ? (
              <>
                <NavLink
                  to="/auth/login"
                  className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link
                  }
                  onClick={onNavClick}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/auth/register"
                  className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link
                  }
                  onClick={onNavClick}
                >
                  Sign up
                </NavLink>
              </>
            ) : (
              <NavLink
                to="#"
                className={styles.link}
                onClick={(e) => {
                  e.preventDefault();
                  closeAll();
                  handleLogout();
                }}
              >
                Logout
              </NavLink>
            )}
          </nav>

          <button
            type="button"
            className={styles.hamburger}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((v) => !v);
              if (menuOpen) setGithubOpen(false);
            }}
          >
            <span
              className={`${styles.bars} ${menuOpen ? styles.barsOpen : ""}`}
            >
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        <div className={`${styles.mobilePanel} ${menuOpen ? styles.open : ""}`}>
          {showHome && (
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? `${styles.mobileLink} ${styles.active}`
                  : styles.mobileLink
              }
              end
              onClick={onNavClick}
            >
              Home
            </NavLink>
          )}

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? `${styles.mobileLink} ${styles.active}`
                : styles.mobileLink
            }
            onClick={onNavClick}
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? `${styles.mobileLink} ${styles.active}`
                : styles.mobileLink
            }
            onClick={onNavClick}
          >
            Contact
          </NavLink>

          <NavLink
            to="#"
            className={() =>
              githubOpen
                ? `${styles.mobileLink} ${styles.active}`
                : styles.mobileLink
            }
            onClick={(e) => {
              e.preventDefault();
              setGithubOpen((v) => !v);
            }}
          >
            Github
          </NavLink>

          <div
            className={`${styles.mobileGithubCard} ${
              githubOpen ? styles.mobileGithubOpen : ""
            }`}
          >
            <a
              className={styles.mobileGithubItem}
              href="https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Frontend"
              target="_blank"
              rel="noreferrer"
              onClick={closeAll}
            >
              Frontend Repo →
            </a>

            <a
              className={styles.mobileGithubItem}
              href="https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Backend"
              target="_blank"
              rel="noreferrer"
              onClick={closeAll}
            >
              Backend Repo →
            </a>
          </div>

          {!isLoggedIn ? (
            <>
              <NavLink
                to="/auth/login"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.mobileLink} ${styles.active}`
                    : styles.mobileLink
                }
                onClick={onNavClick}
              >
                Login
              </NavLink>

              <NavLink
                to="/auth/register"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.mobileLink} ${styles.active}`
                    : styles.mobileLink
                }
                onClick={onNavClick}
              >
                Sign up
              </NavLink>
            </>
          ) : (
            <NavLink
              to="#"
              className={styles.mobileLink}
              onClick={(e) => {
                e.preventDefault();
                closeAll();
                handleLogout();
              }}
            >
              Logout
            </NavLink>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}
