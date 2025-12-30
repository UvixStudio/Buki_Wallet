import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buki Wallet - Vercel Test",
  description: "Family wallet application - Testing Vercel deployment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
