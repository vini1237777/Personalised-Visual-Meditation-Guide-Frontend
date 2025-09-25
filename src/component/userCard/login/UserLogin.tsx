import { useNavigate } from "react-router-dom";
import {
  noMemberText,
  signupButtonText,
  submitButton,
} from "../../../helpers/constants";
import "./UserLogin.css";
import { UserService } from "../../../services/userServices";
import toast from "react-hot-toast";
import { useCallback } from "react";
import LandingPage from "../../landingPage/LandingPage";
import { IUser } from "../../../helpers/interface";

const userConstants = [
  { type: "email", id: "email", name: "email", label: "Email" },
  { type: "password", id: "password", name: "password", label: "Password" },
];

interface UserLoginProps {
  setUserState: (updater: (prev: IUser) => IUser) => void;
  userState: IUser;
  setIsLoggedIn?: any;
  isLoggedIn?: boolean;
}

function UserLogin({
  setUserState,
  userState,
  setIsLoggedIn,
  isLoggedIn,
}: UserLoginProps) {
  const navigate = useNavigate();

  // const [fullName, setFullName] = useState("");

  const handleChange = useCallback(
    (e: any) => {
      const { name, value } = e.target;
      setUserState((prevState: IUser) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [setUserState]
  );

  const handleLogin = useCallback(async () => {
    await UserService.login(userState)
      .then((res: any) => {
        if (res.status === 200) {
          toast.success("Successfully logged in");
          setUserState((prev: IUser) => ({
            ...prev,
            ...res?.data,
          }));
          setIsLoggedIn(true);
          // setFullName(res?.data?.user?.fullName || "");
        }
      })
      .catch(() => {
        toast.error("Failed to log in");
        navigate("/");
      });
  }, [navigate, setIsLoggedIn, setUserState, userState]);

  return (
    <div className="userLogin">
      {isLoggedIn ? (
        <LandingPage user={{ ...userState }} setUserState={setUserState} />
      ) : (
        <div className="userLogin-wrapper">
          <span className="userLogin-form-title">
            {noMemberText}
            <span className="userLoginText" onClick={() => navigate("/")}>
              {signupButtonText}
            </span>
          </span>

          {userConstants?.map((constants) => (
            <div className="userLogin-button-wrapper" key={constants.id}>
              <div className="userLogin-form">
                <label className="userLogin-form-label" htmlFor={constants.id}>
                  {constants.label}
                </label>
                <span>
                  <input
                    type={constants.type}
                    id={constants.id}
                    name={constants.name}
                    required
                    className="userLogin-form-input"
                    onChange={handleChange}
                    value={userState?.[constants.name] || ""}
                    // autoComplete={
                    //   constants.type === "password"
                    //     ? "current-password"
                    //     : "email"
                    // }
                    aria-label={constants.label}
                  />
                </span>
              </div>
            </div>
          ))}

          <div className="userLogin-button-wrapper">
            <button className="userLogin-button" onClick={handleLogin}>
              {submitButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserLogin;
