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
  "What is SoulSync?": new Content(
    "What is SoulSync?",
    "SoulSync is a calm, visual meditation experience designed to help you slow down and reset in a few minutes.",
    ""
  ),

  "Why we built it": new Content(
    "Why we built it",
    "Modern life is noisy and fast. SoulSync was created for people who want a quiet moment without pressure or complicated routines. Our focus is a smooth, minimal experience that feels calming from the first screen.",
    ""
  ),

  "How it works": [
    new Content(
      "How it works",
      [
        "Pick your mood",
        "Continue to your session",
        "Explore demo when needed",
      ],
      [
        "Select what matches your current feeling (calm, focus, energy, etc.).",
        "The app prepares your guided session with visuals and prompts.",
        "If live sessions are paused, SoulSync switches to curated demo sessions so your experience stays uninterrupted.",
      ]
    ),
  ],

  // "Who it’s for": [
  //   new Content(
  //     "Who it’s for",
  //     [
  //       "- Anyone who wants a calm break during work, study, or travel.",
  //       "- Beginners who want a simple, non-overwhelming meditation flow.",
  //       "- People who prefer visual guidance instead of long instructions.",
  //       "- Anyone looking for a gentle way to reset and relax.",
  //     ],
  //     "SoulSync is helpful for"
  //   ),
  // ],

  "Demo note": [
    new Content(
      "Demo note",
      "Depending on live availability, some sessions may run in curated demo mode. This keeps the experience smooth while you explore the product flow.",
      ""
    ),
  ],
};

export const contentListArray = Object.values(contentList).flatMap(
  (content) => content
);

export const ABOUT_TEXT = {
  title: "About SoulSync",
  description:
    "SoulSync is a personalised visual meditation guide that helps you choose a mood and receive a calming meditation experience. The goal is to keep the experience simple, fast, and safe — with clean UI boundaries and scalable architecture.",
} as const;
