import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Committee | Karnataka Vishwakarma Association",
};

const committees = [
  {
    name: "Managing Committee",
    members: [
      { role: "President", name: "To be updated" },
      { role: "Vice President", name: "To be updated" },
      { role: "General Secretary", name: "To be updated" },
      { role: "Joint Secretary", name: "To be updated" },
      { role: "Treasurer", name: "To be updated" },
    ],
  },
  {
    name: "Education & Social Welfare",
    members: [
      { role: "Chairperson", name: "To be updated" },
      { role: "Secretary", name: "To be updated" },
      { role: "Member", name: "To be updated" },
    ],
  },
  {
    name: "Mahila Vibhaga",
    members: [
      { role: "Chairperson", name: "To be updated" },
      { role: "Secretary", name: "To be updated" },
      { role: "Joint Secretary", name: "To be updated" },
    ],
  },
];

const yuvaMembers = [
  { name: "Sandesh J Acharya", role: "Chairperson", photo: "/commitee-images/youth-wing/IMG_20251206_131047.jpg"},
  { name: "Ashwath S Acharya", role: "Vice-Chairperson", photo2: "/commitee-images/youth-wing/IMG_3718.JPG", photo: "/commitee-images/youth-wing/IMG_20251228_160723.jpg" },
  { name: "Siddhesh D Acharya", role: "Jt-Convenor", photo: "/commitee-images/youth-wing/IMG_20251223_141526.jpg" },
  { name: "Pranav Acharya", role: "Convenor", photo: "/commitee-images/youth-wing/IMG20260314125209.jpg" },
  { name: "Sagar B Acharya", role: "Member", photo: "/commitee-images/youth-wing/IMG-20251224-WA0045.jpg" },
  { name: "Rhea S Acharya", role: "Member", photo: "/commitee-images/youth-wing/IMG-20251224-WA0028.jpg" },
  { name: "Shivani H Acharya", role: "Member", photo: encodeURI("/commitee-images/youth-wing/IMG_20251225_222236 (1).jpg") },
  { name: "Rajesh A Acharya", role: "Member", photo: "/commitee-images/youth-wing/IMG-20251224-WA0029.jpg" },
  { name: "Rajesh S Acharya", role: "Member", photo: "/commitee-images/youth-wing/IMG-20251224-WA0042.jpg" },
  { name: "Shailesh Acharya", role: "Member", photo: "/commitee-images/youth-wing/IMG-20251224-WA0018.jpg" },
  { name: "Jayshri S Acharya", role: "Member", photo: "/commitee-images/youth-wing/IMG-20251223-WA0040.jpg" },
  { name: "Shashin Acharya", role: "Member", photo: encodeURI("/commitee-images/youth-wing/shashin passport.jpg") },
  { name: "Sahana Acharya", role: "Member", photo: "/commitee-images/youth-wing/3_20251222_194501_0002.png" },
  { name: "Bhagyashree Acharya", role: "Member", photo: "/commitee-images/youth-wing/IMG_1005.jpg" },
  { name: "Arpit Acharya", role: "Member", photo: "/commitee-images/youth-wing/0K8A0893.jpg" },
];

export default function CommitteePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-kva-text">
          Our <span className="text-primary">Committee</span>
        </h1>
        <p className="mt-2 text-kva-text-light">
          The dedicated team leading KVA Mumbai
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {committees.map((committee) => (
          <div
            key={committee.name}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-kva-text">
              <span className="h-1 w-6 rounded-full bg-primary" />
              {committee.name}
            </h2>
            <div className="space-y-3">
              {committee.members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-primary/5"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-sm font-bold text-white">
                    {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-kva-text">{member.name}</p>
                    <p className="text-xs text-primary-dark">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Yuva Vibhaga — full-width with member photos */}
      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-kva-text">
          <span className="h-1 w-6 rounded-full bg-primary" />
          Yuva Vibhaga
        </h2>
        <div className="grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
          {yuvaMembers.map((member, index) => (
            <div key={index} className="group flex flex-col items-center gap-2">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary/20 transition-all group-hover:border-primary group-hover:shadow-md">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-kva-text">{member.name}</p>
                <p className="text-[10px] text-primary-dark">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Former Committee Link */}
      <div className="mt-10 rounded-2xl bg-kva-bg-alt p-8 text-center">
        <h3 className="text-lg font-semibold text-kva-text">Former Committee Members</h3>
        <p className="mt-2 text-sm text-kva-text-light">
          We honor and acknowledge the contributions of all former committee members
          who have served KVA Mumbai over the decades.
        </p>
      </div>
    </div>
  );
}
