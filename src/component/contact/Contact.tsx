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

  const handleSubmit = () => {
    toast.success(
      () =>
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
            {contactConstants?.map((constants) => {
              return (
                <div className="contact-form">
                  <span className="contact-form-label">{constants.label}</span>
                  <span>
                    <input
                      type={constants.type}
                      id={constants.id}
                      name={constants.name}
                      required
                      className="contact-form-input"
                    />
                  </span>
                </div>
              );
            })}
          </div>
          <button
            type="submit"
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
