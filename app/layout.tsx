import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Twibix | Rubik's Cube Timer",
  description: "A timer app for speedcubing enthusiasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
