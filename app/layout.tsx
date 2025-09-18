import type { Metadata } from "next";
import Provider from "@/components/provider";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Macstudio Nexus CMS",
  description: "Official Content Management System of Macstudio Nexus",
  icons: {
    icon: "/temp-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSans.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
