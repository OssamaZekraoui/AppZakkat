import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://diyae-zakkat.vercel.app"),
  title: "ضياء — Diyae",
  description: "منصة إسلامية غير ربحية للزكاة والتبرعات والتضامن المجتمعي",
  icons: {
    icon: "/diyae-logo.png",
    apple: "/diyae-logo.png",
  },
  openGraph: {
    title: "ضياء — Diyae",
    description: "منصة إسلامية غير ربحية للزكاة والتبرعات والتضامن المجتمعي",
    siteName: "Diyae",
    type: "website",
    images: [
      {
        url: "/diyae-logo.png",
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
    images: ["/diyae-logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
