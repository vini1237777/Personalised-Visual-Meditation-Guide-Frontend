class Content {
  subTitle: string | string[] | null | undefined;
  description: string | string[];
  title: string | string[] | null;
  constructor(
    title: string | string[],
    description: string | string[],
    subTitle?: string | string[] | null
  ) {
    this.title = title;
    this.description = description;
    this.subTitle = subTitle;
  }
}

export const contentList = {
  "What is Visual Meditation?": new Content(
    "What is Visual Meditation?",
    "Visual Meditation is a unique blend of mindfulness and guided imagery that uses the power of your imagination to create vivid, peaceful experiences. Instead of focusing only on breath or sound, our sessions immerse you in mental landscapes, protective auras, and empowering symbols helping you relax and focus with ease.",
    ""
  ),
  "Our Purpose": new Content(
    "Our Purpose",
    "In a fast-moving world, stillness can be hard to find. Our mission is to make meditation more accessible, engaging, and visually stimulating so that anyone from complete beginners to experienced meditators can connect with their inner calm.",
    ""
  ),

  "Benefits You Can Expect": [
    new Content(
      "Benefits You Can Expect",
      ["Stress Relief", "Better Focus", "Creative Boost", "Emotional Balance"],
      [
        "Release daily tension through calming mental imagery.",
        "Train your mind to concentrate through guided visual exercises.",
        "Use imagery to inspire new ideas and perspectives.",
        "Strengthen positive emotions with uplifting visuals.",
      ]
    ),
  ],

  "How It Works": [
    new Content(
      "How It Works",
      ["Choose a Theme", "Experience Guided Imagery", "Feel the Shift"],
      [
        "Calm, focus, energy, or protection.",
        "Our scripts paint vivid, soothing mental scenes.",
        "Let your thoughts slow, your body relax, and your mind recharge.",
      ]
    ),
  ],

  "Who It’s For": [
    new Content(
      "Who It’s For",
      [
        "- Is looking for a new way to relax and de-stress.",
        "- Wants to improve their focus and concentration.",
        "- Is interested in exploring their creativity.",
        "- Needs a break from their busy lifestyle.",
      ],
      "Visual Meditation is perfect for anyone who"
    ),
  ],
  "Join the Journey": [
    new Content(
      "Join the Journey",
      "Step into a space where meditation is more than silence, it’s a colorful journey for your mind. With Visual Meditation, peace is something you can see, feel, and carry with you anywhere.",
      ""
    ),
  ],
};
export const contentListArray = Object.values(contentList).flatMap(
  (content) => content
);
