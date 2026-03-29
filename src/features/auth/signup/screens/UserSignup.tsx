import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import styles from "./UserSignup.module.css";
import { UserService } from "services/userServices";
import { BG_VIDEOS } from "../../../../assets/bg-videos/videoUrls";
import { useVideoBackground } from "../../../../shared/custom-hooks/Usevideobackground";

type SignupForm = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FieldErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;

function validateFullName(v: string) {
  if (!v.trim()) return "Full name is required.";
  if (v.trim().length < 2) return "Please enter a valid name.";
}
function validateEmail(v: string) {
  if (!v.trim()) return "Email is required.";
  if (!emailRegex.test(v.toLowerCase())) return "Invalid email format.";
}
function validatePassword(v: string) {
  if (!v.trim()) return "Password is required.";
  if (v.length < 8) return "Minimum 8 characters required.";
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return "Use letters and numbers.";
}
function validateConfirm(pwd: string, confirm: string) {
  if (!confirm.trim()) return "Please confirm password.";
  if (pwd !== confirm) return "Passwords do not match.";
}

export default function UserSignup() {
  const navigate = useNavigate();
  const { videoRef, ready } = useVideoBackground(BG_VIDEOS.bg4);

  const [form, setForm] = useState<SignupForm>({
    fullName: "Vinisha Yadav",
    email: "v@gmail.com",
    password: "v@123456",
    confirmPassword: "v@123456",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange =
    (key: keyof SignupForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        if (key === "fullName") next.fullName = validateFullName(value);
        if (key === "email") next.email = validateEmail(value);
        if (key === "password") {
          next.password = validatePassword(value);
          next.confirmPassword = validateConfirm(value, form.confirmPassword);
        }
        if (key === "confirmPassword") {
          next.confirmPassword = validateConfirm(form.password, value);
        }
        return next;
      });
    };

  const validateAll = () => {
    const next: FieldErrors = {
      fullName: validateFullName(form.fullName),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirm(form.password, form.confirmPassword),
    };
    setErrors(next);
    return Object.values(next).every((e) => !e);
  };

  const handleSignup = async () => {
    if (!validateAll()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await UserService.register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      if (res.status !== 200 && res.status !== 201) {
        toast.error("Signup failed. Please try again.");
        return;
      }
      toast.success("Account created. Please login.");
      navigate("/auth/login");
    } catch (err: any) {
      toast.error(err?.message ?? "Signup error");
      console.error("Signup error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* poster shows instantly while video loads */}
      <div className={styles.poster} />

      {/* video fades in once playing */}
      <video
        ref={videoRef}
        className={styles.videoBg}
        loop
        muted
        playsInline
        style={{ opacity: ready ? 1 : 0, transition: "opacity 0.8s ease" }}
      />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>Meditation App</h1>
          <p className={styles.heroSubtitle}>
            Welcome to the Meditation App! Find your peace and calm.
          </p>
        </header>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.title}>Create account</h2>
            <p className={styles.subtitle}>
              Already a member?{" "}
              <button
                type="button"
                className={styles.link}
                onClick={() => navigate("/auth/login")}
              >
                Log in
              </button>
            </p>
          </div>

          <div className={styles.form}>
            <Field
              label="Full Name"
              value={form.fullName}
              onChange={onChange("fullName")}
              error={errors.fullName}
              isDisabled
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={onChange("email")}
              error={errors.email}
              isDisabled
            />
            <Field
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={onChange("password")}
              error={errors.password}
              isDisabled
            />
            <Field
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={onChange("confirmPassword")}
              error={errors.confirmPassword}
              isDisabled
            />

            <div className={styles.row}>
              <div className={styles.rowSpacer} />
              <label className={styles.showPass}>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword((v) => !v)}
                  disabled
                />
                Show password
              </label>
            </div>

            <button className={styles.button} onClick={handleSignup} disabled>
              {isSubmitting ? "Creating..." : "Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  isDisabled = false,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  isDisabled?: boolean;
}) {
  return (
    <div className={styles.row}>
      <label className={styles.label}>{label}</label>
      <div className={styles.control}>
        <input
          type={type}
          className={styles.input}
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          disabled={isDisabled}
        />
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}
