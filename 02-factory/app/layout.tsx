import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Example: Factory Pattern | Next.js",
  description: "Educational prototype of the Factory design pattern",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
