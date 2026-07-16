import type { Metadata } from "next";
import { Cormorant_Garamond, Instrument_Sans, Noto_Serif_TC } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TeaCompanion } from "@/components/TeaCompanion";
import { LanguageProvider } from "@/lib/language";
import { site } from "@/lib/site";

const displaySerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap"
});

const cjkSerif = Noto_Serif_TC({
  weight: ["400", "500", "600", "700"],
  variable: "--font-cjk",
  display: "swap",
  preload: false
});

const interfaceSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | One Cup. One Breath. One Return.`,
    template: `%s | ${site.name}`
  },
  description: site.description,
  metadataBase: new URL("https://kritinrautela.github.io/chazen-website/"),
  openGraph: {
    title: "Chazen 茶禪 | One Cup. One Breath. One Return.",
    description: site.description,
    url: "https://kritinrautela.github.io/chazen-website/",
    siteName: "Chazen 茶禪",
    images: [
      {
        url: "images/chazen-tea-room-hero-v2.jpg",
        width: 1672,
        height: 941,
        alt: "Chazen tea room — modern Chinese tea culture and quiet ritual."
      }
    ],
    locale: "en_AU",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Chazen 茶禪 | One Cup. One Breath. One Return.",
    description: site.description,
    images: ["images/chazen-tea-room-hero-v2.jpg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displaySerif.variable} ${cjkSerif.variable} ${interfaceSans.variable}`}>
      <body>
        <LanguageProvider>
          <div className="page-shell">
            <Header />
            {children}
            <Footer />
            <TeaCompanion />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
