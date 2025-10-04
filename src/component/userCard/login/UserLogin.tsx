import { useNavigate } from "react-router-dom";
import {
  noMemberText,
  signupButtonText,
  submitButton,
} from "../../../helpers/constants";
import "./UserLogin.css";
import { UserService } from "../../../services/userServices";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
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

  const [errors, setErrors] = useState<{
    email: string | null;
    password: string | null;
  }>({
    email: null,
    password: null,
  });

  const validateEmail = (email: string): string | null => {
    const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!email || email.trim() === "") return "Email is required.";
    if (!re.test(String(email).toLowerCase())) return "Invalid email format.";
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password || password.trim() === "") return "Password is required.";
    return null;
  };

  const validators: Record<keyof typeof errors, (v: string) => string | null> =
    {
      email: validateEmail,
      password: validatePassword,
    };

  const validateField = (name: keyof typeof validators, value: string) => {
    const err = validators[name](value);
    setErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const validateAll = useCallback(() => {
    const emailErr = validateEmail(userState?.email || "");
    const passErr = validatePassword(userState?.password || "");
    const next = { email: emailErr, password: passErr };
    setErrors(next);
    return next;
  }, [userState]);
  // =========================

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserState((prevState: IUser) => ({
      ...prevState,
      [name]: value,
    }));

    if (name in validators) {
      validateField(name as keyof typeof validators, value);
    }
  };

  useEffect(() => {
    setUserState((prev: any) => ({
      ...prev,
      email: "",
      password: "",
    }));
    setErrors({ email: null, password: null });
  }, [setUserState]);

  const handleLogin = useCallback(async () => {
    const current = validateAll();
    const hasErrors = Object.values(current).some(Boolean);
    if (hasErrors) {
      toast.error("Fix the highlighted fields first.");
      return;
    }

    await UserService.login({
      email: userState?.email,
      password: userState?.password,
    })
      .then((res: any) => {
        if (res.status === 200) {
          toast.success("Successfully logged in");
          setUserState((prev: IUser) => ({
            ...prev,
            ...res?.data,
          }));
          setIsLoggedIn(true);
        }
      })
      .catch((err: any) => {
        console.error("Login error:", err);
      });
  }, [setIsLoggedIn, userState, validateAll, setUserState]);

  const isSubmitDisabled =
    !!errors.email ||
    !!errors.password ||
    !userState?.email ||
    !userState?.password;

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
                    className={`userLogin-form-input ${
                      !errors[constants.name as keyof typeof errors] &&
                      userState[constants.name]
                        ? "valid"
                        : ""
                    }`}
                    onChange={handleChange}
                    value={userState?.[constants.name] || ""}
                    aria-invalid={
                      errors[constants.name as keyof typeof errors]
                        ? "true"
                        : "false"
                    }
                    aria-describedby={`${constants.id}-error`}
                  />
                </span>

                {errors[constants.name as keyof typeof errors] && (
                  <span
                    id={`${constants.id}-error`}
                    role="alert"
                    className="userLogin-error"
                  >
                    {errors[constants.name as keyof typeof errors]}
                  </span>
                )}
              </div>
            </div>
          ))}

          <div className="userLogin-button-wrapper">
            <button
              className="userLogin-button"
              onClick={handleLogin}
              disabled={isSubmitDisabled}
            >
              {submitButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserLogin;
