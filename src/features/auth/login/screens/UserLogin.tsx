import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import styles from "./UserLogin.module.css";
import { useAuth } from "../../../../app/providers/AuthProvider";
import type { User } from "../../../user/model/user.types";
import { UserService } from "../../../../services/userServices";
import { ApiError } from "../../../../shared/api/http";

type LoginForm = {
  email: string;
  password: string;
};

type FieldErrors = {
  email?: string;
  password?: string;
};

function validateEmail(email: string): string | undefined {
  const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
  if (!email.trim()) return "Email is required.";
  if (!re.test(email.toLowerCase())) return "Invalid email format.";
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password.trim()) return "Password is required.";
  return undefined;
}

export default function UserLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  // ✅ Autofill here
  const [form, setForm] = useState<LoginForm>({
    email: "v@gmail.com",
    password: "v@123456",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      !isSubmitting &&
      form.email.trim().length > 0 &&
      form.password.trim().length > 0 &&
      !errors.email &&
      !errors.password
    );
  }, [errors.email, errors.password, form.email, form.password, isSubmitting]);

  const onChange =
    (key: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));

      setErrors((prev) => {
        const next = { ...prev };
        if (key === "email") next.email = validateEmail(value);
        if (key === "password") next.password = validatePassword(value);
        return next;
      });
    };

  const validateAll = (): boolean => {
    const next: FieldErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setErrors(next);
    return !next.email && !next.password;
  };

  const handleSubmit = async () => {
    if (!validateAll()) {
      toast.error("Fix the highlighted fields first.");
      return;
    }

    try {
      setIsSubmitting(true);
      try {
        const res = await UserService.login({
          email: form.email,
          password: form.password,
        });

        if (res?.status !== 200) {
          toast.error("Login failed. Please try again.");
          return;
        }

        const data = res?.data ?? {};
        const loggedInUser: User = {
          email: data.email ?? form.email,
          fullName: data.fullName ?? data.name ?? "",
          category: data.category ?? "",
          id: data.id ?? "",
        };

        setUser(loggedInUser);
        toast.success("Successfully logged in");

        const from = (location.state as any)?.from?.pathname ?? "/";
        navigate(from, { replace: true });
      } catch (e) {
        if (e instanceof ApiError) toast.error(e.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Login error. Try again.");
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>Login</h2>
          <p className={styles.subtitle}>
            Don’t have an account?{" "}
            <span
              className={styles.link}
              onClick={() => navigate("/auth/register")}
              role="button"
              tabIndex={0}
            >
              Sign up
            </span>
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            value={form.email}
            onChange={onChange("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            autoComplete="email"
          />
          {errors.email && (
            <div id="email-error" className={styles.error} role="alert">
              {errors.email}
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            value={form.password}
            onChange={onChange("password")}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            autoComplete="current-password"
          />
          {errors.password && (
            <div id="password-error" className={styles.error} role="alert">
              {errors.password}
            </div>
          )}
        </div>

        <button
          type="button"
          className={styles.button}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {isSubmitting ? "Logging in..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
