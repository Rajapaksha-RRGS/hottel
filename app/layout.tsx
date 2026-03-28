import './globals.css'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Aurelia Grand Hotel | Luxury Redefined",
  description:
    "Experience timeless elegance and modern luxury at Aurelia Grand Hotel. Book your unforgettable stay today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
