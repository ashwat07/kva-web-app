"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type CommitteeMember = {
  name: string;
  role: string;
  photo: string;
  photo2?: string;
};

function shuffleMembers<T>(array: T[]): T[] {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function splitAndShuffle(members: CommitteeMember[]): CommitteeMember[] {
  const officers = members.filter((m) => m.role !== "Member");
  const membersOnly = members.filter((m) => m.role === "Member");
  const shuffledMembers = shuffleMembers(membersOnly);
  return [...officers, ...shuffledMembers];
}

interface ShuffledWingSectionProps {
  members: CommitteeMember[];
  variant: "ladies" | "youth";
  title: string;
  logoSrc: string;
  logoAlt: string;
  columnsClass?: string;
}

export function ShuffledWingSection({
  members,
  variant,
  title,
  logoSrc,
  logoAlt,
  columnsClass = "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6",
}: ShuffledWingSectionProps) {
  const [shuffled, setShuffled] = useState<CommitteeMember[] | null>(null);

  useEffect(() => {
    setShuffled(splitAndShuffle(members));
    // Shuffle once on mount so order is random but stable for the session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Skeleton while shuffle is computed (avoids hydration mismatch)
  if (shuffled === null) {
    return (
      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-3 text-lg font-bold text-kva-text">
          <span className="relative h-8 w-8 flex-shrink-0 rounded-lg bg-gray-50 p-1 ring-1 ring-gray-100">
            <Image
              src={logoSrc}
              alt={logoAlt}
              fill
              className="object-contain p-0.5"
              aria-hidden
            />
          </span>
          {title}
        </h2>
        <div className={`grid gap-5 ${columnsClass}`}>
          {members.map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-20 w-20 animate-pulse rounded-full bg-gray-100" />
              <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
              <div className="h-3 w-12 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isLadies = variant === "ladies";
  const STAGGER_MS = 45;

  return (
    <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-6 flex items-center gap-3 text-lg font-bold text-kva-text">
        <span className="relative h-8 w-8 flex-shrink-0 rounded-lg bg-gray-50 p-1 ring-1 ring-gray-100">
          <Image
            src={logoSrc}
            alt={logoAlt}
            fill
            className="object-contain p-0.5"
            aria-hidden
          />
        </span>
        {title}
      </h2>
      <div className={`grid gap-5 ${columnsClass}`}>
        {shuffled.map((member, index) => (
          <div
            key={`${member.name}-${member.role}`}
            className="group flex flex-col items-center gap-2 animate-slide-up-stagger"
            style={{ animationDelay: `${index * STAGGER_MS}ms` }}
          >
            <div
              className={
                isLadies
                  ? "relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-gradient-to-br from-primary/20 to-primary/10 transition-all group-hover:border-primary group-hover:shadow-md"
                  : "relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary/20 transition-all group-hover:border-primary group-hover:shadow-md"
              }
            >
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className={
                    isLadies
                      ? "object-cover object-top transition-transform duration-300 group-hover:scale-110"
                      : "object-cover transition-transform duration-300 group-hover:scale-110"
                  }
                />
              ) : (
                <span className="text-xl font-bold text-primary-dark">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-kva-text">{member.name}</p>
              <p className="text-[10px] text-primary-dark">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
