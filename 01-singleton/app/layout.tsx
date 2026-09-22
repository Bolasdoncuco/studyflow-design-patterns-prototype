import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Example: Singleton Pattern | Next.js",
  description: "Educational prototype of the Singleton design pattern",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
