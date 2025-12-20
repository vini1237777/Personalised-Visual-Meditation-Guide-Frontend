import { useEffect, useState } from "react";
import "./Loader.css";

const messages = [
  "Breathe in… and out.",
  "Slow down. You’re here now.",
  "Preparing your meditation…",
  "A calm session is almost ready.",
];

const Loader = ({ title = "Preparing your session…" }: { title?: string }) => {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeout(() => {
        setI((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 900);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="loader-container">
      <div className="bl-circle" aria-label="Breathing animation" />
      <p className="bl-title">While you wait, try this:</p>
      <p className={`bl-message ${visible ? "show" : "hide"}`}>{messages[i]}</p>
    </div>
  );
};

export default Loader;
