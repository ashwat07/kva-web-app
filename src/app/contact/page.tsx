import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Karnataka Vishwakarma Association",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-kva-text">
          Contact <span className="text-primary">Us</span>
        </h1>
        <p className="mt-2 text-kva-text-light">
          We&apos;d love to hear from you. Reach out to us anytime.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-6">
          {/* Registered Office */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">🏢</span>
              <h2 className="text-lg font-semibold text-kva-text">Registered Office</h2>
            </div>
            <p className="text-sm leading-relaxed text-kva-text-light">
              D-9, Daswani Apartments,<br />
              Four Bungalows, Azad Nagar,<br />
              Andheri(W) - 400053, Mumbai
            </p>
          </div>

          {/* Administrative Office */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-lg">📋</span>
              <h2 className="text-lg font-semibold text-kva-text">Administrative Office</h2>
            </div>
            <p className="text-sm leading-relaxed text-kva-text-light">
              Row House No. 16A, Hill View CHS,<br />
              Kashimira Miraroad(E) - 401104
            </p>
          </div>

          {/* Phone & Email */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-lg">📞</span>
                <div>
                  <p className="text-xs text-kva-text-light">Phone</p>
                  <p className="font-medium text-kva-text">+91 22 26355608</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-lg">📧</span>
                <div>
                  <p className="text-xs text-kva-text-light">Email</p>
                  <p className="font-medium text-kva-text">kvamumbai1962@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-semibold text-kva-text">Follow Us</h3>
            <div className="flex gap-3">
              {["Facebook", "Twitter", "LinkedIn"].map((platform) => (
                <span
                  key={platform}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-kva-text-light transition-colors hover:bg-primary/10 hover:text-primary-dark"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-kva-text">Send us a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-kva-text">Full Name</label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-kva-text">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-kva-text">Phone</label>
              <input
                type="tel"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-kva-text">Subject</label>
              <select className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary">
                <option>General Inquiry</option>
                <option>Membership</option>
                <option>Events</option>
                <option>Matrimony</option>
                <option>Educational Aid</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-kva-text">Message</label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Your message..."
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-dark py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
