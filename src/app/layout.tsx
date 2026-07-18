import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://diyae-zakkat.vercel.app"),
  title: "ضياء — Diyae",
  description: "منصة إسلامية غير ربحية للزكاة والتبرعات والتضامن المجتمعي",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
  },
  openGraph: {
    title: "ضياء — Diyae",
    description: "منصة إسلامية غير ربحية للزكاة والتبرعات والتضامن المجتمعي",
    siteName: "Diyae",
    type: "website",
    images: [
      {
        url: "/diyae-logo.png?v=2",
        width: 1024,
        height: 1024,
        alt: "شعار ضياء — Diyae",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "ضياء — Diyae",
    description: "منصة إسلامية غير ربحية للزكاة والتبرعات والتضامن المجتمعي",
    images: ["/diyae-logo.png?v=2"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
