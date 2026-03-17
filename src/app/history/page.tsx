import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our History | Karnataka Vishwakarma Association",
};

const milestones = [
  { year: "1945", title: "Foundation", description: "The Karnataka Vishwakarma Association was established in Mumbai with the vision to unite and uplift the community." },
  { year: "1962", title: "Growing Community", description: "KVA gained significant membership and started organizing regular cultural and religious events." },
  { year: "1968", title: "Charitable Trust Registration", description: "KVA was officially registered as a charitable trust, expanding its scope to education and social welfare." },
  { year: "1980s", title: "Education Focus", description: "Launched scholarship programs and educational aid initiatives for deserving students from the community." },
  { year: "1990s", title: "Mahila & Yuva Vibhaga", description: "Formed dedicated wings for women empowerment (Mahila Vibhaga) and youth development (Yuva Vibhaga)." },
  { year: "2000s", title: "Sports & Wellness", description: "Introduced annual sports meets, yoga camps, and health awareness programs for community wellness." },
  { year: "2010s", title: "Digital Transformation", description: "Launched the community website, Samvadi members database, and digital communication channels." },
  { year: "2020s", title: "Modern Era", description: "Embracing technology with the KVA app, online events, and expanded community reach across Mumbai with ~1,200 active members." },
];

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-kva-text">
          Our <span className="text-primary">History</span>
        </h1>
        <p className="mt-2 text-kva-text-light">
          Over 80 years of community service and cultural preservation
        </p>
      </div>

      {/* About */}
      <div className="mb-12 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 p-8">
        <p className="leading-relaxed text-kva-text">
          The Karnataka Vishwakarma Association (KVA), Mumbai, was established in the year 1945
          with an objective to preserve tradition and serve society in the area of education,
          medical, social &amp; cultural aspects, encourage young generation to improve their
          skills, support sports activities, empower women and girls. The association was
          registered as a charitable trust in 1968 and has since been a pillar of community
          strength and unity.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 h-full w-0.5 bg-primary/20 md:left-1/2 md:-translate-x-px" />
        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.year}
              className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className="flex-1 pb-2 pl-16 md:pl-0 md:pr-12 md:text-right">
                {index % 2 === 0 && (
                  <div className="md:ml-auto md:mr-0">
                    <span className="text-sm font-bold text-primary">{milestone.year}</span>
                    <h3 className="text-lg font-semibold text-kva-text">{milestone.title}</h3>
                    <p className="mt-1 text-sm text-kva-text-light">{milestone.description}</p>
                  </div>
                )}
              </div>
              <div className="absolute left-4 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-white md:static md:mx-0 md:flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1 pl-16 md:pl-12">
                {index % 2 !== 0 && (
                  <div>
                    <span className="text-sm font-bold text-primary">{milestone.year}</span>
                    <h3 className="text-lg font-semibold text-kva-text">{milestone.title}</h3>
                    <p className="mt-1 text-sm text-kva-text-light">{milestone.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
