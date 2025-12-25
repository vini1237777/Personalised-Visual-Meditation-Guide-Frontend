import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import styles from "./Contact.module.css";
import { CONTACT_TEXT } from "../constants/contact.text";
import type {
  ContactFormErrors,
  ContactFormValues,
} from "../model/contact.types";

const EMAIL_RE = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;

function validate(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!values.name.trim()) errors.name = CONTACT_TEXT.required;
  if (!values.email.trim()) errors.email = CONTACT_TEXT.required;
  else if (!EMAIL_RE.test(values.email.toLowerCase()))
    errors.email = CONTACT_TEXT.invalidEmail;

  if (!values.message.trim()) errors.message = CONTACT_TEXT.required;

  return errors;
}

export default function Contact() {
  const [values, setValues] = useState<ContactFormValues>({
    name: "",
    email: "",
    message: "",
  });

  const [touched, setTouched] = useState<
    Partial<Record<keyof ContactFormValues, boolean>>
  >({});

  const errors = useMemo(() => validate(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  const setField = <K extends keyof ContactFormValues>(
    key: K,
    value: string
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const markTouched = <K extends keyof ContactFormValues>(key: K) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const showError = (key: keyof ContactFormValues) =>
    Boolean(touched[key] && errors[key]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ name: true, email: true, message: true });

    if (!isValid) {
      toast.error("Fix the highlighted fields.");
      return;
    }

    toast.success(CONTACT_TEXT.success);
    setValues({ name: "", email: "", message: "" });
    setTouched({});
  };

  return (
    <main className={styles.page}>
      <form className={styles.card} onSubmit={onSubmit} noValidate>
        <div className={styles.header}>
          <h1 className={styles.title}>{CONTACT_TEXT.title}</h1>
          <p className={styles.subtitle}>{CONTACT_TEXT.subtitle}</p>
        </div>

        <div className={styles.row}>
          <label className={styles.rowLabel} htmlFor="contact-name">
            {CONTACT_TEXT.nameLabel}
          </label>

          <div className={styles.rowControl}>
            <input
              id="contact-name"
              className={`${styles.input} ${
                showError("name") ? styles.inputError : ""
              }`}
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              onBlur={() => markTouched("name")}
              aria-invalid={showError("name")}
            />
            {showError("name") && (
              <span className={styles.error}>{errors.name}</span>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.rowLabel} htmlFor="contact-email">
            {CONTACT_TEXT.emailLabel}
          </label>

          <div className={styles.rowControl}>
            <input
              id="contact-email"
              className={`${styles.input} ${
                showError("email") ? styles.inputError : ""
              }`}
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              onBlur={() => markTouched("email")}
              aria-invalid={showError("email")}
            />
            {showError("email") && (
              <span className={styles.error}>{errors.email}</span>
            )}
          </div>
        </div>

        <div className={`${styles.row} ${styles.rowTopAlign}`}>
          <label className={styles.rowLabel} htmlFor="contact-message">
            {CONTACT_TEXT.messageLabel}
          </label>

          <div className={styles.rowControl}>
            <textarea
              id="contact-message"
              className={`${styles.textarea} ${
                showError("message") ? styles.inputError : ""
              }`}
              value={values.message}
              onChange={(e) => setField("message", e.target.value)}
              onBlur={() => markTouched("message")}
              aria-invalid={showError("message")}
              rows={5}
            />
            {showError("message") && (
              <span className={styles.error}>{errors.message}</span>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.button} type="submit" disabled={!isValid}>
            {CONTACT_TEXT.submit}
          </button>
        </div>
      </form>
    </main>
  );
}
