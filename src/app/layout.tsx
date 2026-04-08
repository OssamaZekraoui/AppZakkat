import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ضياء — Diyae",
  description: "منصة إسلامية غير ربحية للزكاة والتبرعات والتضامن المجتمعي",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
