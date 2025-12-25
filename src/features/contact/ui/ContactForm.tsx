import styles from "../Contact.module.css";

export default function ContactForm() {
  return (
    <form className={styles.form}>
      <h1>Contact Us</h1>

      <input type="text" placeholder="Your name" />
      <input type="email" placeholder="Your email" />
      <textarea placeholder="Your message" rows={4} />

      <button type="submit">Send</button>
    </form>
  );
}
