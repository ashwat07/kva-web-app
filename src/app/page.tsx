import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "KVA Feed",
    description: "Latest updates and news about KVA activities and presidential engagements",
    icon: "📰",
    href: "/feed",
    color: "from-orange-500 to-amber-500",
  },
  {
    title: "Events & Calendar",
    description: "Upcoming KVA events, meetings, and community celebrations",
    icon: "📅",
    href: "/events",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Samvadi",
    description: "Community members database and directory",
    icon: "👥",
    href: "/samvadi",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Notifications",
    description: "Stay updated on events, meetings, and shradhanjali announcements",
    icon: "🔔",
    href: "/events",
    color: "from-purple-500 to-violet-500",
  },
  {
    title: "Matrimony",
    description: "Find suitable matches within the Vishwakarma community",
    icon: "💑",
    href: "/matrimony",
    color: "from-rose-500 to-pink-500",
  },
  {
    title: "Gallery",
    description: "Photos and memories from KVA events and celebrations",
    icon: "🖼️",
    href: "/gallery",
    color: "from-indigo-500 to-blue-500",
  },
];

const annualEvents = [
  "Shri Vishwakarma Mahotsava",
  "Talents' Day",
  "Women's Day Celebration",
  "Children's Day",
  "Blood Donation & Medical Camps",
  "Yoga Day",
  "Annual Sports Meet",
  "Monthly & Annual Bhajan Sessions",
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1a0a00] via-[#2d1200] to-[#3d1a00]">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 rounded-full border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <Image
                src="/kva-logo.png"
                alt="KVA Logo"
                width={100}
                height={100}
                className="drop-shadow-xl"
                priority
              />
            </div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-light/80">
              Est. 1945
            </p>

            <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              The Karnataka Vishwakarma Association (Regd.) - Mumbai
            </h1>

            <p className="mt-2 text-sm font-medium tracking-wide text-white/50 md:text-base">
              Serving the community for over 80 years
            </p>

            <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
              Preserving tradition and serving society through education, medical services,
              social &amp; cultural initiatives. Empowering our community with ~1,200 active members.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/events"
                className="rounded-full bg-primary px-7 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:bg-primary-light hover:shadow-xl"
              >
                Upcoming Events
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/20 px-7 py-2.5 text-sm font-semibold text-white/80 transition-all hover:border-white/40 hover:bg-white/5 hover:text-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-kva-text md:text-3xl">
            Explore <span className="text-primary">KVA</span>
          </h2>
          <p className="mt-2 text-kva-text-light">Everything you need, all in one place</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-2xl shadow-sm`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-kva-text group-hover:text-primary-dark">
                {feature.title}
              </h3>
              <p className="mt-1 text-sm text-kva-text-light">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-kva-bg-alt">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-kva-text md:text-3xl">
                About <span className="text-primary">KVA Mumbai</span>
              </h2>
              <p className="mt-4 leading-relaxed text-kva-text-light">
                Karnataka Vishwakarma Association (KVA), Mumbai, was established in the year 1945
                with an objective to preserve tradition and serve society in the area of education,
                medical, social &amp; cultural aspects, encourage young generation to improve their
                skills, support sports activities, empower women and girls.
              </p>
              <p className="mt-3 leading-relaxed text-kva-text-light">
                Registered as a charitable trust in 1968, KVA continues to strengthen community
                bonds through talent recognition, wellness activities, sports tournaments,
                women empowerment programs, and community health camps.
              </p>
              <Link
                href="/history"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-dark hover:text-primary"
              >
                Learn our history
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-kva-text">Annual Events &amp; Activities</h3>
              <div className="space-y-2">
                {annualEvents.map((event, i) => (
                  <div key={event} className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary-dark">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-kva-text">{event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-primary-dark py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Join Our Community</h2>
          <p className="mt-3 text-white/80">
            Stay connected with the Vishwakarma community. Get updates on events,
            access Samvadi, and be part of our growing family.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/samvadi"
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary-dark shadow-lg transition-all hover:scale-105"
            >
              Access Samvadi
            </Link>
            <Link
              href="/matrimony"
              className="rounded-full border-2 border-white px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              KVA Matrimony
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
