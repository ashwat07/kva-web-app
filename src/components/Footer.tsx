import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-kva-text to-black pb-20 text-white md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Image src="/kva-logo.png" alt="KVA Logo" width={48} height={48} className="rounded-full" />
              <div>
                <p className="font-bold">Karnataka Vishwakarma</p>
                <p className="text-sm text-white/70">Association (Regd.), Mumbai</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              Established in 1945, KVA Mumbai serves the community through education,
              medical, social &amp; cultural initiatives with ~1,200 active members.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-bold text-primary-light">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "History", href: "/history" },
                { label: "Events", href: "/events" },
                { label: "KVA Feed", href: "/feed" },
                { label: "Samvadi", href: "/samvadi" },
                { label: "Matrimony", href: "/matrimony" },
                { label: "Gallery", href: "/gallery" },
                { label: "Committee", href: "/committee" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/70 transition-colors hover:text-primary-light"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-bold text-primary-light">Contact Us</h3>
            <div className="space-y-3 text-sm text-white/70">
              <div>
                <p className="font-semibold text-white/90">Registered Office</p>
                <p>D-9, Daswani Apartments, Four Bungalows,</p>
                <p>Azad Nagar, Andheri(W) - 400053</p>
              </div>
              <div>
                <p className="font-semibold text-white/90">Administrative Office</p>
                <p>Row House No. 16A, Hill View CHS,</p>
                <p>Kashimira Miraroad(E) - 401104</p>
              </div>
              <p>
                <span className="font-semibold text-white/90">Phone:</span> +91 22 26355608
              </p>
              <p>
                <span className="font-semibold text-white/90">Email:</span> kvamumbai1962@gmail.com
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} Karnataka Vishwakarma Association (Regd.), Mumbai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
