import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVA Feed | Karnataka Vishwakarma Association",
};

const feedItems = [
  {
    date: "March 10, 2026",
    title: "President Shri Attended as Chief Guest at Vishwakarma Jayanti Celebration",
    description:
      "Our esteemed President was invited as the Chief Guest at the annual Vishwakarma Jayanti celebration organized by the local chapter. The event was attended by over 500 community members.",
    category: "Presidential Visit",
    image: "🏛️",
  },
  {
    date: "March 5, 2026",
    title: "KVA Annual Blood Donation Camp – A Grand Success",
    description:
      "The annual blood donation camp organized by KVA saw participation from 150+ donors. The event was conducted in collaboration with Kokilaben Hospital.",
    category: "Health Camp",
    image: "🩸",
  },
  {
    date: "February 28, 2026",
    title: "Scholarship Distribution Ceremony 2025-26",
    description:
      "KVA distributed scholarships to 75 meritorious students from the community. The ceremony was graced by senior committee members and educational trustees.",
    category: "Education",
    image: "🎓",
  },
  {
    date: "February 15, 2026",
    title: "Inter-Association Cricket Tournament Victory",
    description:
      "KVA cricket team emerged victorious in the inter-association tournament held at Andheri Sports Complex. Congratulations to the winning team!",
    category: "Sports",
    image: "🏏",
  },
  {
    date: "February 1, 2026",
    title: "Mahila Vibhaga - Women's Wellness Workshop",
    description:
      "The Mahila Vibhaga organized a wellness workshop focusing on mental health and nutrition. Over 80 women participated in the interactive session.",
    category: "Women Empowerment",
    image: "💪",
  },
  {
    date: "January 26, 2026",
    title: "Republic Day Celebration at KVA Hall",
    description:
      "KVA celebrated Republic Day with a flag hoisting ceremony followed by cultural programs presented by Yuva Vibhaga members.",
    category: "Cultural",
    image: "🇮🇳",
  },
];

export default function FeedPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-kva-text">
          KVA <span className="text-primary">Feed</span>
        </h1>
        <p className="mt-2 text-kva-text-light">
          Latest updates, news, and presidential engagements
        </p>
      </div>

      <div className="space-y-6">
        {feedItems.map((item, index) => (
          <article
            key={index}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex flex-col md:flex-row">
              <div className="flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-8 text-5xl md:w-32">
                {item.image}
              </div>
              <div className="flex-1 p-6">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary-dark">
                    {item.category}
                  </span>
                  <span className="text-xs text-kva-text-light">{item.date}</span>
                </div>
                <h2 className="text-lg font-semibold text-kva-text">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-kva-text-light">
                  {item.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-kva-text-light">
          More updates coming soon. Stay connected!
        </p>
      </div>
    </div>
  );
}
