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
        <div className="banner-text">
          <h1>{appTitle}</h1>
          <p>{bannerText}</p>
        </div>

        <div className="banner-form">
          {isLoginPage ? (
            <UserLogin
              userState={userState}
              setUserState={setUserState}
              setIsLoggedIn={setIsLoggedIn}
              isLoggedIn={isLoggedIn}
            />
          ) : (
            <UserSignup userState={userState} setUserState={setUserState} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Banner;
