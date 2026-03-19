import type { Metadata } from "next";
import Image from "next/image";
import { ShuffledWingSection } from "./ShuffledWingSection";

export const metadata: Metadata = {
  title: "Committee | Karnataka Vishwakarma Association",
};

const managingCommitteeMembers = [
  { name: "Ravish G Acharya", role: "President", photo: "/commitee-images/management-commitee/ravish.jpeg" },
  { name: "Ganesh Kumar K", role: "Vice President", photo: "/commitee-images/management-commitee/ganesh-kumar.jpeg" },
  { name: "Sudhir J Acharya", role: "Joint Secretary", photo: "/commitee-images/management-commitee/sudhir.jpeg" },
  { name: "Prasad Acharya", role: "Joint Secretary", photo: "/commitee-images/management-commitee/prasad.jpeg" },
  { name: "Baburaj M Acharya", role: "Treasurer", photo: "/commitee-images/management-commitee/baburaj.jpeg" },
  { name: "Ravindra I P Acharya", role: "Joint Treasurer", photo: "/commitee-images/management-commitee/ravindra.jpeg" },
];

const mahilaVibhagaMembers = [
  { name: "Sujata G Acharya", role: "Chairperson", photo: "/commitee-images/ladies-wing/sujata.jpeg" },
  { name: "Veena Acharya", role: "Vice Chairperson", photo: "/commitee-images/ladies-wing/veena.jpeg" },
  { name: "Amitha D Acharya", role: "Joint Convenor", photo: "/commitee-images/ladies-wing/amitha.jpeg" },
  { name: "Rajeshwari Acharya", role: "Convenor", photo: "/commitee-images/ladies-wing/rajeshwari.jpeg" },
  { name: "Kalpana C Acharya", role: "Member", photo: "/commitee-images/ladies-wing/kalpana.jpeg" },
  { name: "Manjula R Acharya", role: "Member", photo: "/commitee-images/ladies-wing/manjula.jpeg" },
  { name: "Shobha D Acharya", role: "Member", photo: "/commitee-images/ladies-wing/shobha.jpeg" },
  { name: "Shubha S Acharya", role: "Member", photo: "/commitee-images/ladies-wing/shubha-sunil.jpeg" },
  { name: "Suchitra H Acharya", role: "Member", photo: "/commitee-images/ladies-wing/suchitra.jpeg" },
  { name: "Pushpalatha S Acharya", role: "Member", photo: "/commitee-images/ladies-wing/pushpa.jpeg" },
  { name: "Jayalaxmi D Acharya", role: "Member", photo: "/commitee-images/ladies-wing/jayalaxmi-damodar.jpeg" },
  { name: "Jayalaxmi J Acharya", role: "Member", photo: "/commitee-images/ladies-wing/jayalaxmi.jpeg" },
  { name: "Rajivi K Acharya", role: "Member", photo: "/commitee-images/ladies-wing/rajivi.jpeg" },
  { name: "Jayashree R Acharya", role: "Member", photo: "/commitee-images/ladies-wing/jayshree.jpeg" },
  { name: "Meera S Acharya", role: "Member", photo: "/commitee-images/ladies-wing/meera.jpeg" },
  { name: "Jayamala B Acharya", role: "Member", photo: "/commitee-images/ladies-wing/jayamala.jpeg" },
  { name: "Usha S Acharya", role: "Member", photo: "/commitee-images/ladies-wing/usha-sadanand.jpeg" },
  { name: "Yogini R Acharya", role: "Member", photo: "/commitee-images/ladies-wing/yogini.jpeg" },
  { name: "Geeta M Acharya", role: "Member", photo: "/commitee-images/ladies-wing/geeta.jpeg" },
  { name: "Chandrakala S Acharya", role: "Member", photo: "/commitee-images/ladies-wing/chandrakala.jpeg" },
  { name: "Pramila B Acharya", role: "Member", photo: "/commitee-images/ladies-wing/pramila.jpeg" },
  { name: "Jyoti P Acharya", role: "Member", photo: "/commitee-images/ladies-wing/jyoti-prakash.jpeg" },
];

const yuvaMembers = [
  { name: "Sandesh J Acharya", role: "Chairperson", photo: "/commitee-images/youth-wing/IMG_20251206_131047.jpg" },
  { name: "Ashwath S Acharya", role: "Vice-Chairperson", photo: "/commitee-images/youth-wing/ashwat.jpeg", photo2: "/commitee-images/youth-wing/IMG_20251228_160723.jpg" },
  { name: "Siddhesh D Acharya", role: "Joint-Convenor", photo: "/commitee-images/youth-wing/IMG_20251223_141526.jpg" },
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
  { name: "Shamita P Acharya", role: "Member", photo: "/commitee-images/youth-wing/shamita.png" },
  { name: "Jagadish Acharya", role: "Member", photo: "/commitee-images/youth-wing/jagadish.jpeg" },
  { name: "Aishwarya S Acharya", role: "Member", photo: "/commitee-images/youth-wing/aishwarya.jpeg" },
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

      {/* Managing Committee */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-kva-text">
          <span className="h-1 w-6 rounded-full bg-primary" />
          Managing Committee
        </h2>
        <div className="grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {managingCommitteeMembers.map((member, index) => (
            <div key={index} className="group flex flex-col items-center gap-2">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary/20 transition-all group-hover:border-primary group-hover:shadow-md">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-110"
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

      {/* Mahila Vibhaga – members shuffled so everyone gets a turn at the top */}
      <ShuffledWingSection
        members={mahilaVibhagaMembers}
        variant="ladies"
        title="Ladies Wing"
        logoSrc="/committee-logos/mahila-vibhaga.png"
        logoAlt=""
        columnsClass="grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
      />

      {/* Yuva Vibhaga – members shuffled so everyone gets a turn at the top */}
      <ShuffledWingSection
        members={yuvaMembers}
        variant="youth"
        title="Youth Wing"
        logoSrc="/committee-logos/youth-wing-light.png"
        logoAlt=""
        columnsClass="grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7"
      />

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
