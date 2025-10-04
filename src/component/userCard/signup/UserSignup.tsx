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
import { useEffect, useRef, useState } from "react"; // ✅ NEW

const userConstants = [
  { type: "text", id: "fullName", name: "fullName", label: "Full Name" },
  { type: "email", id: "email", name: "email", label: "Email" },
  { type: "password", id: "password", name: "password", label: "Password" },
];

function UserSignup({
  setIsLoggedIn,
  setUserState,
  userState,
  isLoggedIn,
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
  }>({
    fullName: null,
    email: null,
    password: null,
  });

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

  const validators: Record<string, (v: string) => string | null> = {
    fullName: validateFullName,
    email: validateEmail,
    password: validatePassword,
  };

  // useEffect(() => {
  //   const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  //   if (savedUser && Object.values(userState || {}).length > 0) {
  //     navigate("/auth/login");
  //   }
  // }, [navigate, setIsLoggedIn, userState]);

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
    setUserState((prevState: IUser) => ({
      ...prevState,
      [name]: value,
    }));
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
    }));
    didInit.current = true;

    setErrors({ fullName: null, email: null, password: null });
  }, [setUserState]);

  const handleSignUp = async () => {
    const current = validateAll();
    const hasErrors = Object.values(current).some(Boolean);
    if (hasErrors) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    await UserService.register({ ...userState })
      .then((res: any) => {
        if (res.status === 201) {
          setUserState((prev: IUser) => ({
            ...prev,
            ...res?.data,
          }));
          toast.success("Successfully created user");
          navigate("/auth/login");
        }
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to sign up");
      });
  };

  const isSubmitDisabled =
    !!errors.fullName ||
    !!errors.email ||
    !!errors.password ||
    !userState?.fullName ||
    !userState?.email ||
    !userState?.password;

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(userState));
  }, [userState]);

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
          const fieldName = constants.name as keyof typeof errors;
          const errMsg = errors[fieldName];
          const value = userState?.[constants.name] || "";

          return (
            <div className="userCard-button-wrapper" key={constants.id}>
              {/* ^ added key only, rendering structure unchanged */}
              <div className="userCard-form">
                <span className="userCard-form-label">{constants.label}</span>
                <span>
                  <input
                    type={constants.type}
                    id={constants.id}
                    name={constants.name}
                    className={`userCard-form-input ${
                      !errMsg && value ? "valid" : ""
                    }`}
                    onChange={handleChange}
                    value={value}
                    aria-invalid={errMsg ? "true" : "false"}
                    aria-describedby={`${constants.id}-error`}
                  />
                </span>

                {errMsg && (
                  <span
                    id={`${constants.id}-error`}
                    role="alert"
                    className="userCard-error"
                  >
                    {errMsg}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        <div className="userSignup-button-wrapper">
          <button
            className="userCard-button"
            onClick={() => {
              handleSignUp();
            }}
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
