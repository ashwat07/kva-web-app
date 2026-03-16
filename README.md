# KVA Mumbai — Official Web App

The official digital platform for **The Karnataka Vishwakarma Association (Regd.), Mumbai** — a modern, mobile-first Progressive Web App (PWA) built to serve the KVA community.

> Visit us at [kvamumbai.org](https://www.kvamumbai.org)

---

## About

Founded in 1945, KVA Mumbai is a charitable trust with over 1200 active members. This platform brings the entire KVA experience to your fingertips — installable directly from your mobile browser, no app store required.

---

## Features

- **KVA Feed** — Latest updates, announcements, and highlights including presidential engagements and community news
- **Events & Calendar** — Upcoming KVA events, cultural programmes, and important dates at a glance
- **Samvadi** — Member directory and community connect
- **Notifications** — Real-time push notifications for events, management meetings, and shradhanjali announcements
- **Matrimony** — A trusted matrimony platform exclusively for KVA community members
- **PWA Support** — Install directly from your mobile browser for a native app-like experience on both Android and iOS

---

## Tech Stack

- **Framework** — [Next.js 14+](https://nextjs.org) (App Router)
- **Language** — TypeScript
- **Database & Auth** — [Supabase](https://supabase.com)
- **Styling** — Tailwind CSS
- **PWA** — next-pwa
- **Push Notifications** — Web Push API
- **OTP Authentication** — MSG91 (SMS & WhatsApp OTP)
- **Hosting** — [Vercel](https://vercel.com)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/kva-mumbai.git

# Navigate into the project
cd kva-mumbai

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
MSG91_API_KEY=your_msg91_api_key
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Installing as a Mobile App (PWA)

No app store needed. To install:

**Android:** Open the site in Chrome → tap the three-dot menu → "Add to Home Screen"

**iOS:** Open the site in Safari → tap the Share icon → "Add to Home Screen"

The app will appear on your home screen and behave just like a native app.

---

## Deployment

The app is deployed on [Vercel](https://vercel.com). Every push to the `main` branch triggers an automatic deployment.

```bash
# Build for production
npm run build
```

Refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Contributing

This project is maintained by the KVA Mumbai tech volunteers. For contributions, bug reports, or feature requests, please open an issue or reach out to the managing committee.

---

## Contact

**Regd. Office** — D-9, Daswani Apartments, Four Bungalows, Azad Nagar, Andheri (W) - 400053

**Email** — kvamumbai1962@gmail.com

**Phone** — +91 22 26355608

---

© 2025 The Karnataka Vishwakarma Association (Regd.), Mumbai. All rights reserved.
