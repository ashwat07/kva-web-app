"use client";

import { useState } from "react";

const profiles = [
  {
    id: 1, name: "Ananya V.", age: 26, education: "MBA", occupation: "Marketing Manager",
    location: "Mumbai", height: "5'4\"", gotra: "Sanaga", about: "Outgoing, family-oriented, loves cooking and traveling.",
  },
  {
    id: 2, name: "Rahul A.", age: 29, education: "B.Tech", occupation: "Software Engineer",
    location: "Mumbai", height: "5'10\"", gotra: "Bharadwaj", about: "Ambitious, sports enthusiast, values family traditions.",
  },
  {
    id: 3, name: "Priya B.", age: 24, education: "B.Com", occupation: "Chartered Accountant",
    location: "Thane", height: "5'3\"", gotra: "Kashyap", about: "Spiritual, creative, enjoys reading and classical music.",
  },
  {
    id: 4, name: "Vikram G.", age: 31, education: "M.Tech", occupation: "Civil Engineer",
    location: "Navi Mumbai", height: "5'11\"", gotra: "Atri", about: "Grounded, hardworking, active in community service.",
  },
  {
    id: 5, name: "Sneha K.", age: 27, education: "MBBS", occupation: "Doctor",
    location: "Mumbai", height: "5'5\"", gotra: "Vashishta", about: "Caring, disciplined, passionate about healthcare.",
  },
  {
    id: 6, name: "Aditya S.", age: 28, education: "B.Arch", occupation: "Architect",
    location: "Pune", height: "5'9\"", gotra: "Jamadagni", about: "Creative thinker, loves design and heritage architecture.",
  },
];

export default function MatrimonyPage() {
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");


  const maleNames = ["Rahul", "Vikram", "Aditya"];
  const filtered = genderFilter === "all"
    ? profiles
    : genderFilter === "male"
    ? profiles.filter((p) => maleNames.some((n) => p.name.startsWith(n)))
    : profiles.filter((p) => !maleNames.some((n) => p.name.startsWith(n)));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-kva-text">
          KVA <span className="text-primary">Coming Soon</span>
        </h1>
        <p className="mt-2 text-kva-text-light">
          Find suitable matches within the Vishwakarma community
        </p>
      </div>

      {/* Register Banner */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 p-6">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <span className="text-4xl">💍</span>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-semibold text-rose-800">Register Your Profile</h3>
            <p className="mt-1 text-sm text-rose-600">
              Create your matrimony profile and connect with eligible matches from the community.
              All profiles are verified by KVA committee members.
            </p>
          </div>
          <button className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105">
            Register Now
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {(["all", "male", "female"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setGenderFilter(f)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              genderFilter === f
                ? "bg-primary text-white"
                : "bg-gray-100 text-kva-text-light hover:bg-gray-200"
            }`}
          >
            {f === "all" ? "All Profiles" : f === "male" ? "Groom" : "Bride"}
          </button>
        ))}
      </div>

      {/* Profiles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((profile) => (
          <div
            key={profile.id}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg"
          >
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-2xl font-bold text-white shadow-lg">
                {profile.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-kva-text">{profile.name}</h3>
              <p className="text-sm text-kva-text-light">{profile.age} years • {profile.location}</p>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-kva-text-light">Education</p>
                  <p className="font-medium text-kva-text">{profile.education}</p>
                </div>
                <div>
                  <p className="text-xs text-kva-text-light">Occupation</p>
                  <p className="font-medium text-kva-text">{profile.occupation}</p>
                </div>
                <div>
                  <p className="text-xs text-kva-text-light">Height</p>
                  <p className="font-medium text-kva-text">{profile.height}</p>
                </div>
                <div>
                  <p className="text-xs text-kva-text-light">Gotra</p>
                  <p className="font-medium text-kva-text">{profile.gotra}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-kva-text-light">{profile.about}</p>
              <button className="mt-4 w-full rounded-xl bg-primary/10 py-2.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary/20">
                View Full Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
