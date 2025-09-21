import "./UserSignup.css";
import {
  loginText,
  memberText,
  signupButtonText,
} from "../../../helpers/constants";
// import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserService } from "../../../services/userServices";
import toast from "react-hot-toast";

const userConstants = [
  { type: "text", id: "fullName", name: "fullName", label: "Full Name" },
  { type: "email", id: "email", name: "email", label: "Email" },
  { type: "password", id: "password", name: "password", label: "Password" },
];

function UserSignup({
  setIsLoggedIn,
  setUserState,
  userState,
}: {
  setIsLoggedIn: any;
  setUserState: any;
  userState: any;
}) {
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignUp = async () => {
    await UserService.register({ ...userState })
      .then((res: any) => {
        if (res.status === 201) {
          toast.success("Successfully created user");
          navigate("/auth/login");
        }
      })
      .catch((err) => {
        console.log(err, "what is the message");
        toast.error(err);
      });
  };

  return (
    <div className="userCard">
      <div className="userCard-wrapper">
        <span className="userCard-form-title">
          {memberText}
          <span
            className="userCard-login"
            onClick={() => {
              navigate("/auth/login");
            }}
          >
            {loginText}
          </span>
        </span>

        {userConstants?.map((constants) => {
          return (
            <div className="userCard-button-wrapper">
              <div className="userCard-form">
                <span className="userCard-form-label">{constants.label}</span>
                <span>
                  <input
                    type={constants.type}
                    id={constants.id}
                    name={constants.name}
                    required
                    className="userCard-form-input"
                    onChange={handleChange}
                    value={userState[constants.name as typeof userState]}
                  />
                </span>
              </div>
            </div>
          );
        })}
        <div className="userCard-button-wrapper">
          <button
            className="userCard-button"
            onClick={() => {
              handleSignUp();
            }}
          >
            {signupButtonText}
          </button>
          <div className="arrow-button">
            {/* <FaArrowRight color="white" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSignup;
