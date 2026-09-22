import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "StudyFlow | Academic Planner", description: "A design-patterns academic task planner" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
