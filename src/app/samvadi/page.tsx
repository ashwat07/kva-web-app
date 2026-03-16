"use client";

import { useState } from "react";
import type { Metadata } from "next";

const members = [
  { id: 1, name: "Rajesh Vishwakarma", area: "Andheri West", phone: "9876XXXXXX", occupation: "Business" },
  { id: 2, name: "Sunita Achari", area: "Mira Road", phone: "9876XXXXXX", occupation: "Teacher" },
  { id: 3, name: "Venkatesh Badiger", area: "Borivali", phone: "9876XXXXXX", occupation: "Engineer" },
  { id: 4, name: "Lakshmi Gudigar", area: "Malad", phone: "9876XXXXXX", occupation: "Doctor" },
  { id: 5, name: "Suresh Kanchari", area: "Dahisar", phone: "9876XXXXXX", occupation: "Advocate" },
  { id: 6, name: "Meera Silpi", area: "Kandivali", phone: "9876XXXXXX", occupation: "Business" },
  { id: 7, name: "Ganesh Achari", area: "Andheri East", phone: "9876XXXXXX", occupation: "Architect" },
  { id: 8, name: "Priya Vishwakarma", area: "Thane", phone: "9876XXXXXX", occupation: "Software Engineer" },
];

export default function SamvadiPage() {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");

  const areas = ["all", ...new Set(members.map((m) => m.area))];
  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.occupation.toLowerCase().includes(search.toLowerCase());
    const matchArea = areaFilter === "all" || m.area === areaFilter;
    return matchSearch && matchArea;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-kva-text">
          <span className="text-primary">Samvadi</span> — Members Directory
        </h1>
        <p className="mt-2 text-kva-text-light">
          Connect with fellow community members across Mumbai
        </p>
      </div>

      {/* Login Notice */}
      <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔐</span>
          <div>
            <h3 className="font-semibold text-amber-800">Members Only Access</h3>
            <p className="mt-1 text-sm text-amber-700">
              Full contact details and directory access is available to registered KVA members.
              Please log in with your membership credentials to view complete information.
            </p>
            <button className="mt-3 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-dark">
              Member Login
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or occupation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary"
        >
          {areas.map((area) => (
            <option key={area} value={area}>
              {area === "all" ? "All Areas" : area}
            </option>
          ))}
        </select>
      </div>

      {/* Members Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-lg font-bold text-white">
              {member.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-kva-text">{member.name}</h3>
              <p className="text-sm text-kva-text-light">{member.occupation}</p>
              <p className="text-xs text-kva-text-light">📍 {member.area}</p>
            </div>
            <button className="flex-shrink-0 rounded-lg bg-primary/10 p-2 text-primary-dark transition-colors hover:bg-primary/20">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-kva-text-light">
          No members found matching your search criteria.
        </div>
      )}

      <div className="mt-8 text-center text-sm text-kva-text-light">
        Showing {filtered.length} of {members.length} members (demo data)
      </div>
    </div>
  );
}
