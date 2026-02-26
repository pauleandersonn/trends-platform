import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trends Platform",
  description: "Ultra-minimalista platform to discover trends by niche in seconds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
