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
    <html lang="he" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>{children}</body>
    </html>
  );
}
