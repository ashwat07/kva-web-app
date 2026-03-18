import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "The Karnataka Vishwakarma Association, Mumbai",
  description:
    "Official website of Karnataka Vishwakarma Association (Regd.), Mumbai - Established 1945. Serving the community through education, medical, social & cultural initiatives.",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/kva-logo.png", type: "image/png", sizes: "any" }],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KVA Mumbai",
  },
};

export const viewport: Viewport = {
  themeColor: "#D4920B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
