import { useState } from "react";
import toast from "react-hot-toast";
import {
  contactBodyText,
  contactBodyTitle,
  contactButtonSubmitText,
} from "../../helpers/constants";
import "./Contact.css";
import { useNavigate } from "react-router-dom";

const contactConstants = [
  { type: "text", id: "name", name: "name", label: "Name" },
  { type: "email", id: "email", name: "email", label: "Email" },
];

function Contact() {
  const navigate = useNavigate();
  type FormDataKeys = "name" | "email";
  type FormData = Record<FormDataKeys, string>;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required!");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email!");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    toast.success(
      "We have successfully submitted the request, we will soon reach out to you :)"
    );
    navigate("/");
  };

  return (
    <div className="contact">
      <div className="contact-root">
        <h1>{contactBodyTitle}</h1>
        <p>{contactBodyText}</p>
        <div className="contact-wrapper">
          <div className="contact-forms">
            {contactConstants?.map((constants) => (
              <div className="contact-form" key={constants.id}>
                <span className="contact-form-label">{constants.label}</span>
                <span>
                  <input
                    id={constants.id}
                    name={constants.name}
                    value={formData[constants.name as FormDataKeys]}
                    onChange={handleChange}
                    className="contact-form-input"
                  />
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="contact-form-button"
            onClick={handleSubmit}
          >
            {contactButtonSubmitText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Contact;
