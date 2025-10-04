import { useLocation } from "react-router-dom";
import { appTitle, bannerText } from "../../helpers/constants";
import UserSignup from "../userCard/signup/UserSignup";
import "./Banner.css";
import UserLogin from "../userCard/login/UserLogin";

function Banner({
  setUserState,
  userState,
  setIsLoggedIn,
  isLoggedIn,
}: {
  setUserState: any;
  userState: any;
  setIsLoggedIn: any;
  isLoggedIn: boolean;
}) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/auth/login";

  return (
    <div className="banner">
      <div className="banner-wrapper">
        <div>
          <h1>{appTitle}</h1>
          <p>{bannerText}</p>
        </div>
        <div>
          {isLoginPage ? (
            <UserLogin
              userState={userState}
              setUserState={setUserState}
              setIsLoggedIn={setIsLoggedIn}
              isLoggedIn={isLoggedIn}
            />
          ) : (
            <UserSignup
              setIsLoggedIn={setIsLoggedIn}
              userState={userState}
              setUserState={setUserState}
              isLoggedIn={isLoggedIn}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Banner;
