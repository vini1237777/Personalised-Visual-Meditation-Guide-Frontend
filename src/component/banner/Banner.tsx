import { useLocation } from "react-router-dom";
import { appTitle, bannerText } from "../../helpers/constants";
import UserSignup from "../userCard/signup/UserSignup";
import "./Banner.css";
import UserLogin from "../userCard/login/UserLogin";

function Banner({
  setUserState,
  userState,
}: {
  setUserState: any;
  userState: any;
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
            <UserLogin userState={userState} setUserState={setUserState} />
          ) : (
            <UserSignup />
          )}
        </div>
      </div>
    </div>
  );
}

export default Banner;
