"use client";

import { useState } from "react";

const events = [
  // KVA Events 2026-2027
  {
    date: "2026-03-15",
    title: "Mother's Day Special - Mahila Vibhaga",
    time: "4:00 PM - 7:00 PM",
    venue: "KVA Hall, Andheri West",
    type: "event",
    description:
      "Special event celebrating mothers organized by the Mahila Vibhaga.",
  },
  {
    date: "2026-03-19",
    title: "Ugadi Celebration",
    time: "10:00 AM - 2:00 PM",
    type: "festival",
    description:
      "Ugadi (Kannada New Year) celebration with traditional rituals and cultural programs.",
  },
  {
    date: "2026-05-31",
    title: "Career Counseling & Vidyadanam Books Distribution",
    time: "10:00 AM - 4:00 PM",
    type: "event",
    description:
      "Career guidance session for students along with Vidyadanam books distribution to support education.",
  },
  {
    date: "2026-06-21",
    title: "Yoga Day / Health Camp & Blood Donation",
    time: "6:00 AM - 3:00 PM",
    venue: "Priya Vishwakarma Bhavan",
    type: "health",
    description:
      "International Yoga Day celebration combined with health camp and blood donation drive.",
  },
  {
    date: "2026-07-05",
    title: "Badminton Tournament",
    time: "9:00 AM - 6:00 PM",
    venue: "TBD",
    type: "sports",
    description: "KVA Badminton Tournament organized by the Yuva Vibhaga.",
  },
  {
    date: "2026-08-15",
    title: "Independence Day Celebration",
    time: "8:00 AM - 11:00 AM",
    type: "festival",
    description: "Flag hoisting and patriotic cultural programs.",
  },
  {
    date: "2026-08-23",
    title: "KVAFL Season 2 - Football Tournament",
    time: "8:00 AM - 6:00 PM",
    venue: "TBD",
    type: "sports",
    description:
      "Season 2 of the KVA Football League (KVAFL). Community football tournament.",
  },
  {
    date: "2026-09-17",
    title: "Shri Vishwakarma Pooja 2026",
    time: "10:00 AM - 7:00 PM",
    venue: "BAPS Shri Swaminarayan Mandir, Malad East",
    type: "festival",
    description:
      "Grand Vishwakarma Pooja celebration with cultural programs and community lunch.",
  },
  {
    date: "2026-10-24",
    title: "Garba Night",
    time: "7:00 PM - 11:00 PM",
    venue: "TBD",
    type: "event",
    description:
      "Navratri Garba Night celebration organized by the Yuva Vibhaga. An evening of dance, music, and festivities.",
  },
  {
    date: "2026-11-15",
    title: "Indoor Games",
    time: "9:00 AM - 5:00 PM",
    venue: "TBD",
    type: "sports",
    description:
      "Indoor games event featuring carrom, chess, table tennis, and more for all age groups.",
  },
  {
    date: "2026-12-06",
    title: "Outdoor Sports Event",
    time: "7:00 AM - 6:00 PM",
    venue: "TBD",
    type: "sports",
    description:
      "Annual outdoor sports day with track & field events, cricket, and fun games for the whole community.",
  },
  {
    date: "2027-01-10",
    title: "KVA Picnic",
    time: "8:00 AM - 6:00 PM",
    venue: "TBD",
    type: "event",
    description:
      "Annual KVA family picnic. A fun-filled day out for the entire community.",
  },
];

const typeColors: Record<string, string> = {
  festival: "bg-orange-100 text-orange-700",
  meeting: "bg-blue-100 text-blue-700",
  event: "bg-purple-100 text-purple-700",
  health: "bg-green-100 text-green-700",
  sports: "bg-red-100 text-red-700",
};

const typeLabels: Record<string, string> = {
  festival: "Festival",
  meeting: "Meeting",
  event: "Event",
  health: "Health & Wellness",
  sports: "Sports",
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function EventsPage() {
  const [currentMonth, setCurrentMonth] = useState(4); // May (next upcoming)
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const eventDates = events
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .map((e) => new Date(e.date).getDate());

  const filteredEvents =
    selectedFilter === "all"
      ? events
      : events.filter((e) => e.type === selectedFilter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-kva-text">
          Events & <span className="text-primary">Calendar</span>
        </h1>
        <p className="mt-2 text-kva-text-light">
          Stay updated with all upcoming KVA events and community activities
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear((y) => y - 1);
                  } else setCurrentMonth((m) => m - 1);
                }}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h3 className="font-semibold text-kva-text">
                {MONTHS[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear((y) => y + 1);
                  } else setCurrentMonth((m) => m + 1);
                }}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-kva-text-light">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="py-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const hasEvent = eventDates.includes(day);
                return (
                  <div
                    key={day}
                    className={`calendar-day cursor-pointer rounded-lg py-2 ${
                      hasEvent
                        ? "bg-primary font-semibold text-white"
                        : "text-kva-text hover:bg-gray-100"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notifications Panel */}
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-kva-text">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs">
                🔔
              </span>
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="rounded-lg bg-purple-50 p-3">
                <p className="text-xs font-semibold text-purple-700">
                  Upcoming
                </p>
                <p className="text-sm text-kva-text">
                  Career Counseling &amp; Vidyadanam - May 31
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-xs font-semibold text-green-700">Health</p>
                <p className="text-sm text-kva-text">
                  Yoga Day / Health Camp - June 21
                </p>
              </div>
              <div className="rounded-lg bg-red-50 p-3">
                <p className="text-xs font-semibold text-red-700">Sports</p>
                <p className="text-sm text-kva-text">
                  Badminton Tournament - July 5
                </p>
              </div>
              <div className="rounded-lg bg-orange-50 p-3">
                <p className="text-xs font-semibold text-orange-700">
                  Festival
                </p>
                <p className="text-sm text-kva-text">
                  Vishwakarma Pooja - Sept 17
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-semibold text-gray-500">
                  Shradhanjali
                </p>
                <p className="text-sm text-kva-text">
                  Check latest announcements
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Event List */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex flex-wrap gap-2">
            {["all", "festival", "event", "sports", "health"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-kva-text-light hover:bg-gray-200"
                }`}
              >
                {filter === "all" ? "All Events" : typeLabels[filter]}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredEvents.map((event, index) => {
              const d = new Date(event.date);
              return (
                <div
                  key={index}
                  className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex flex-col items-center rounded-xl bg-primary/10 px-4 py-3 text-center">
                    <span className="text-xs font-semibold text-primary-dark">
                      {MONTHS[d.getMonth()].slice(0, 3).toUpperCase()}
                    </span>
                    <span className="text-2xl font-bold text-primary-dark">
                      {d.getDate()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeColors[event.type]}`}
                      >
                        {typeLabels[event.type]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-kva-text">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-sm text-kva-text-light">
                      {event.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-kva-text-light">
                      <span className="flex items-center gap-1">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        {event.venue && (
                          <>
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {event.venue}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
