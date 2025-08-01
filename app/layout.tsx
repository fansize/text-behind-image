import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google'
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://textbehindimage.site'),
  title: "Text Behind Image | Free Online Image Text Overlay Tool",
  description: "Create professional text overlays on images easily. Perfect for Google Slides, presentations, social media posts, and graphic design. Free online tool for putting text behind or in front of images.",
  keywords: "text behind image, image text overlay, Google Slides text overlay, image editing tool, text on images, graphic design tool",
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' }
    ],
  },
  openGraph: {
    title: "Text Behind Image | Free Online Image Text Overlay Tool",
    description: "Create professional text overlays on images easily. Perfect for Google Slides, presentations, social media posts, and graphic design.",
    type: "website",
    url: "https://textbehindimage.site",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1600,
        height: 837,
        alt: "Text Behind Image Tool Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Behind Image | Free Online Image Text Overlay Tool",
    site: "https://textbehindimage.site",
    description: "Create professional text overlays on images easily. Perfect for Google Slides, presentations, and graphic design.",
  },
  alternates: {
    canonical: 'https://textbehindimage.site',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <UserProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <div>
                {children}
                <Toaster />
                <SpeedInsights />
                <Script
                  src="https://umami-selfhost-dusky.vercel.app/script.js"
                  data-website-id="60aa6913-6f99-4cb2-bfea-80d9b06ad74b"
                  strategy="afterInteractive"
                />
              </div>
            </ThemeProvider>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
