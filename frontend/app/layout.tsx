import "./globals.css";
import type { Metadata } from "next";
import { Poppins, Bricolage_Grotesque } from "next/font/google";

const geistSans = Poppins({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: "600",
});

const geistMono = Bricolage_Grotesque({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: "500",
});

export const metadata: Metadata = {
  title: "Veda AI",
  description: "Create assignments using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
