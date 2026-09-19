import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { montserrat } from "./fonts";
import PageTransitionOverlay from "@/components/page-transition-overlay";
import { SiteContentProvider } from "@/lib/site-content-context";
import { getSiteContent } from "@/lib/site-content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://www.happyworldtt.com";
const SITE_NAME = "Happy World Travel Tours";
const SITE_TITLE = "Happy World Travel Tours | Nepal Travel Packages, Trekking & Pilgrimage Trips";
const SITE_DESCRIPTION =
  "Happy World Travel Tours is a Kathmandu-based tour operator offering travel packages in Nepal — trekking, pilgrimage and heritage journeys including Annapurna Base Camp, Kailash Mansarovar Yatra and Everest region trails, planned by a local team.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Happy World Travel Tours",
    "Happy World Tours and Travel",
    "travel packages in Nepal",
    "Nepal travel packages",
    "Nepal tour packages",
    "Nepal tours",
    "Nepal trekking",
    "Annapurna Base Camp trek",
    "Kailash Mansarovar Yatra",
    "Kathmandu tour operator",
    "Nepal pilgrimage tours",
    "Nepal heritage tours",
    "Himalaya trekking packages",
    "Pokhara trekking",
    "best travel agency in Nepal",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  category: "Travel",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/logo/logo.png",
        width: 1536,
        height: 1024,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/logo/logo.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: SITE_NAME,
  alternateName: "Happy World Tours & Travel",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/logo/logo.png`,
  image: `${SITE_URL}/logo/logo.png`,
  telephone: "+977-984-0177646",
  email: "happyworldtt@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kathmandu",
    addressCountry: "NP",
  },
  areaServed: {
    "@type": "Country",
    name: "Nepal",
  },
  priceRange: "$$",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const siteContent = await getSiteContent();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteContentProvider value={siteContent}>
          <PageTransitionOverlay />
          {children}
        </SiteContentProvider>
      </body>
    </html>
  );
}
