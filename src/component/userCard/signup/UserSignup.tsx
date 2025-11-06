import "./UserSignup.css";
import {
  loginText,
  memberText,
  signupButtonText,
} from "../../../helpers/constants";
import { useNavigate } from "react-router-dom";
import { UserService } from "../../../services/userServices";
import toast from "react-hot-toast";
import { IUser } from "../../../helpers/interface";
import { useEffect, useRef, useState } from "react";

const userConstants = [
  { type: "text", id: "fullName", name: "fullName", label: "Full Name" },
  { type: "email", id: "email", name: "email", label: "Email" },
  { type: "password", id: "password", name: "password", label: "Password" },
  {
    type: "password",
    id: "confirm-password",
    name: "confirmPassword",
    label: "Confirm Password",
  },
];

function UserSignup({
  setUserState,
  userState,
}: {
  setIsLoggedIn: any;
  setUserState: any;
  userState: any;
  isLoggedIn: boolean;
}) {
  const navigate = useNavigate();

  const [errors, setErrors] = useState<{
    fullName: string | null;
    email: string | null;
    password: string | null;
  }>({ fullName: null, email: null, password: null });

  const [showPassword, setShowPassword] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const validateFullName = (fullName: string): string | null => {
    if (!fullName || fullName.trim() === "") return "Full name is required.";
    if (fullName.trim().length < 2) return "Please enter a valid name.";
    return null;
  };

  const validateEmail = (email: string): string | null => {
    const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!email || email.trim() === "") return "Email is required.";
    if (!re.test(String(email).toLowerCase())) return "Invalid email format.";
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password || password.trim() === "") return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
      return "Use letters and numbers in your password.";
    return null;
  };

  const validateConfirm = (pwd: string, confirm: string): string | null => {
    if (!confirm || confirm.trim() === "") return "";
    if (pwd !== confirm) return "Passwords do not match.";
    return null;
  };

  const validators: Record<string, (v: string) => string | null> = {
    fullName: validateFullName,
    email: validateEmail,
    password: validatePassword,
  };

  const validateField = (name: keyof typeof errors, value: string) => {
    const err = validators[name](value);
    setErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const validateAll = () => {
    const next = {
      fullName: validateFullName(userState?.fullName || ""),
      email: validateEmail(userState?.email || ""),
      password: validatePassword(userState?.password || ""),
    };
    setErrors(next);
    return next;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setUserState((prevState: IUser) => {
      const next = { ...prevState, [name]: value };

      if (name === "password" || name === "confirmPassword") {
        setConfirmError(
          validateConfirm(next.password || "", next.confirmPassword || "")
        );
      }
      return next;
    });

    if (validators[name]) validateField(name as keyof typeof errors, value);
  };

  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    setUserState((prev: any) => ({
      ...prev,
      email: "",
      password: "",
      fullName: "",
      confirmPassword: "",
    }));
    didInit.current = true;
    setErrors({ fullName: null, email: null, password: null });
  }, [setUserState]);

  useEffect(() => {
    const safe = {
      fullName: userState?.fullName || "",
      email: userState?.email || "",
    };
    localStorage.setItem("user", JSON.stringify(safe));
  }, [userState?.fullName, userState?.email]);

  const handleSignUp = async () => {
    const ce = validateConfirm(
      userState?.password || "",
      userState?.confirmPassword || ""
    );
    setConfirmError(ce);
    if (ce) {
      toast.error(ce);
      return;
    }
    const current = validateAll();
    const hasErrors = Object.values(current).some(Boolean);
    if (hasErrors) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    await UserService.register({
      fullName: userState.fullName,
      email: userState.email,
      password: userState.password,
    })
      .then((res: any) => {
        if (res.status === 201) {
          setUserState((prev: IUser) => ({ ...prev, ...res?.data }));
          toast.success("Successfully created user");
          navigate("/auth/login");
        }
      })
      .catch(() => toast.error("Failed to sign up"));
  };

  const isSubmitDisabled =
    !!errors.fullName ||
    !!errors.email ||
    !!errors.password ||
    !userState?.fullName ||
    !userState?.email ||
    !userState?.password ||
    !userState?.confirmPassword ||
    !!confirmError;

  return (
    <div className="userCard">
      <div className="userCard-wrapper">
        <span className="userCard-form-title">
          {memberText}
          <span
            className="userCard-login"
            onClick={() => navigate("/auth/login")}
          >
            {loginText}
          </span>
        </span>

        {userConstants?.map((constants) => {
          const fieldName = constants.name as keyof typeof errors;
          const errMsg = errors[fieldName];
          const value = userState?.[constants.name] || "";

          const isPwd =
            constants.name === "password" ||
            constants.name === "confirmPassword";

          const inputType = isPwd
            ? showPassword
              ? "text"
              : "password"
            : constants.type;

          return (
            <div className="userCard-button-wrapper" key={constants.id}>
              <div className="userCard-form">
                <span className="userCard-form-label">{constants.label}</span>
                <span>
                  <input
                    type={inputType}
                    id={constants.id}
                    name={constants.name}
                    className={`userCard-form-input ${
                      !errMsg && value ? "valid" : ""
                    }`}
                    onChange={handleChange}
                    value={value}
                    autoComplete={
                      constants.name === "email"
                        ? "email"
                        : isPwd
                        ? "new-password"
                        : undefined
                    }
                    aria-invalid={errMsg ? "true" : "false"}
                    aria-describedby={`${constants.id}-error`}
                  />
                  {constants.id === "confirm-password" && (
                    <label className="userSignup-showpass">
                      <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword((v) => !v)}
                      />
                      <span>Show password</span>
                    </label>
                  )}
                </span>

                {(errMsg ||
                  (constants.id === "confirm-password" && confirmError)) && (
                  <span
                    id={`${constants.id}-error`}
                    role="alert"
                    className="userCard-error"
                  >
                    {errMsg || confirmError}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        <div className="userSignup-button-wrapper">
          <button
            className="userCard-button"
            onClick={handleSignUp}
            disabled={isSubmitDisabled}
          >
            {signupButtonText}
          </button>
          <div className="arrow-button"></div>
        </div>
      </div>
    </div>
  );
}

export default UserSignup;
