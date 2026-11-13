import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import OverviewVideo from "shared/ui/OverviewVideo/OverviewVideo";
import { CtaButton, FeelingChip, Shade, panel } from "shared/ui/kit";
import styles from "./UserLogin.module.css";
import { useAuth } from "../../../../app/providers/AuthProvider";
import type { User } from "../../../user/model/user.types";
import { UserService } from "../../../../services/userServices";
import { ApiError } from "../../../../shared/api/http";
import { BG_VIDEOS } from "../../../../assets/bg-videos/videoUrls";
import { tokenStore } from "../../../../services/storage/tokenStore";
import { useVideoBackground } from "../../../../shared/custom-hooks/Usevideobackground";
import { FEELINGS } from "../../../landing/mood/config/feelings.config";
import { savePendingFeeling } from "../../../landing/mood/lib/pendingFeeling";
import type { Emoji } from "../../../landing/mood/model/mood.types";

type Credentials = {
  email: string;
  password: string;
};

type FieldErrors = {
  email?: string;
  password?: string;
};

/** Shared demo account, so visitors can try a session without signing up. */
const DEMO_ACCOUNT: Credentials = {
  email: "v@gmail.com",
  password: "v@123456",
};

const SESSION_STEPS = [
  { title: "Pick a feeling", hint: "Then the words that fit it." },
  { title: "Take one slow breath", hint: "While your session gets ready." },
  { title: "Watch your session", hint: "A calm video chosen for that feeling." },
  { title: "Check out", hint: "Note how you feel now. It goes to your journal." },
];

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

  const { videoRef, ready } = useVideoBackground(BG_VIDEOS.bg4);

  const [feeling, setFeeling] = useState<Emoji | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Credentials>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showForm) emailRef.current?.focus();
  }, [showForm]);

  const canSubmitForm = useMemo(
    () =>
      !isSubmitting &&
      form.email.trim().length > 0 &&
      form.password.trim().length > 0 &&
      !errors.email &&
      !errors.password,
    [errors.email, errors.password, form.email, form.password, isSubmitting],
  );

  const onChange =
    (key: keyof Credentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({
        ...prev,
        [key]: key === "email" ? validateEmail(value) : validatePassword(value),
      }));
    };

  const logIn = async (credentials: Credentials) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const res = await UserService.login(credentials);
      if (res?.status !== 200) {
        savePendingFeeling(null);
        toast.error("Login failed. Please try again.");
        return;
      }
      const data = res?.data ?? {};
      if (data.token) tokenStore.set(data.token);
      const loggedInUser: User = {
        email: data.email ?? credentials.email,
        fullName: data.fullName ?? data.name ?? "",
        category: data.category ?? "",
        id: data.id ?? "",
      };
      setUser(loggedInUser);
      toast.success("Successfully logged in");
      const from = (location.state as any)?.from?.pathname ?? "/";
      navigate(from, { replace: true });
    } catch (err: any) {
      savePendingFeeling(null);
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error(err?.response?.data?.message ?? "Login error. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startDemo = () => {
    savePendingFeeling(feeling);
    logIn(DEMO_ACCOUNT);
  };

  const submitForm = () => {
    const next: FieldErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setErrors(next);
    if (next.email || next.password) {
      toast.error("Fix the highlighted fields first.");
      return;
    }
    savePendingFeeling(feeling);
    logIn(form);
  };

  return (
    <div className={styles.page}>
      <div className={styles.poster} />
      <video
        ref={videoRef}
        className={styles.videoBg}
        loop
        muted
        playsInline
        style={{ opacity: ready ? 1 : 0, transition: "opacity 0.8s ease" }}
      />
      <Shade tone="left" />

      <div className={styles.layout}>
        <section className={styles.hero}>
          <p className={styles.kicker}>
            <span aria-hidden="true" className={styles.kickerDot} />
            Meditation that starts with how you feel
          </p>

          <h1 className={styles.title}>
            How do you feel
            <br />
            <em>right now?</em>
          </h1>

          <div
            className={styles.feelings}
            role="group"
            aria-label="How you feel right now"
          >
            {FEELINGS.map((f) => (
              <FeelingChip
                key={f.emoji}
                label={f.label}
                dot={f.dot}
                selected={feeling === f.emoji}
                onClick={() =>
                  setFeeling((prev) => (prev === f.emoji ? null : f.emoji))
                }
              />
            ))}
          </div>

          <div className={styles.go}>
            <CtaButton onClick={startDemo} disabled={isSubmitting}>
              {isSubmitting ? "Starting your session" : "Start a session"}
            </CtaButton>
            <p className={styles.goNote}>
              No sign up. The demo account is ready to use.
            </p>
          </div>

        </section>

        <aside className={`${styles.side} ${showForm ? styles.sideOpen : ""}`}>
          {showForm ? (
            <form
              id="login-form"
              className={`${panel.panel} ${styles.form}`}
              onSubmit={(e) => {
                e.preventDefault();
                submitForm();
              }}
              noValidate
            >
              <div className={styles.formHead}>
                <h2 className={styles.formTitle}>Log in</h2>
                <button
                  type="button"
                  className={styles.textButton}
                  onClick={() => setShowForm(false)}
                >
                  <span className={styles.underline}>Back</span>
                </button>
              </div>

              <label className={styles.field}>
                <span className={styles.label}>Email</span>
                <input
                  ref={emailRef}
                  type="email"
                  className={styles.input}
                  value={form.email}
                  onChange={onChange("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  autoComplete="email"
                />
                {errors.email && (
                  <span id="email-error" className={styles.error} role="alert">
                    {errors.email}
                  </span>
                )}
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Password</span>
                <input
                  type="password"
                  className={styles.input}
                  value={form.password}
                  onChange={onChange("password")}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  autoComplete="current-password"
                />
                {errors.password && (
                  <span
                    id="password-error"
                    className={styles.error}
                    role="alert"
                  >
                    {errors.password}
                  </span>
                )}
              </label>

              <CtaButton type="submit" block disabled={!canSubmitForm}>
                {isSubmitting ? "Logging in" : "Log in"}
              </CtaButton>

              <p className={styles.formNote}>
                New here?{" "}
                <Link to="/auth/register" className={styles.underline}>
                  Sign up
                </Link>
              </p>
            </form>
          ) : (
            <div className={`${panel.panel} ${styles.steps}`}>
              <h2 className={styles.stepsTitle}>How a session goes</h2>
              <ol className={styles.stepList}>
                {SESSION_STEPS.map((step, i) => (
                  <li key={step.title} className={styles.step}>
                    <span className={styles.stepNum}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      {step.title}
                      <small className={styles.stepHint}>{step.hint}</small>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </aside>
        <footer className={styles.footer}>
          <div className={styles.footerLinks}>
            <button
              type="button"
              className={styles.textButton}
              onClick={() => setShowOverview(true)}
            >
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="11"
                  fill="none"
                  stroke="rgba(255,255,255,.6)"
                />
                <path d="M10 8v8l6-4z" fill="#fff" />
              </svg>
              <span className={styles.underline}>19 second overview</span>
            </button>
            <span className={styles.account}>
              <span className={styles.accountQuestion}>Have an account? </span>
              <button
                type="button"
                className={styles.textButton}
                aria-expanded={showForm}
                aria-controls="login-form"
                onClick={() => setShowForm(true)}
              >
                <span className={styles.underline}>Log in</span>
              </button>
            </span>
          </div>
          <p className={styles.credit}>
            Designed and built by Vinisha Yadav.{" "}
            <Link to="/about" className={styles.underline}>
              How it is built
            </Link>
          </p>
        </footer>
      </div>

      {showOverview && (
        <OverviewVideo
          onClose={() => setShowOverview(false)}
          demoDisabled={isSubmitting}
          onTryDemo={() => {
            setShowOverview(false);
            startDemo();
          }}
        />
      )}
    </div>
  );
}
