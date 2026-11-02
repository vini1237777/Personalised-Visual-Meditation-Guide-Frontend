export const CONTACT_TEXT = {
  title: "Contact",
  nameLabel: "Name",
  emailLabel: "Email",
  messageLabel: "Message",
  submit: "Send",
  success: "Thanks for writing! This is a demo, so messages are not stored yet.",
  invalidEmail: "Please enter a valid email.",
  required: "This field is required.",
  subtitle: "We would love to hear from you. Every message is read by a real person.",
  formTitle: "Send a message",
  formSubtitle: "Tell us a little and we will get back to you.",
  reasons: [
    { icon: "💡", title: "Share an idea", text: "A feeling you want added, or a session you wish existed." },
    { icon: "🛠️", title: "Report a problem", text: "Something did not load or looked wrong. Tell us where it happened." },
    { icon: "💬", title: "Say hello", text: "Tell us how SoulSync fits into your day." },
  ],
} as const;
