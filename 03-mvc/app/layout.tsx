import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Example: MVC Pattern | Next.js",
  description: "Educational prototype of the MVC design pattern",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
