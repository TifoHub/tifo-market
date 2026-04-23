import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import { CartProvider } from "@/app/context/CartContext";
import "./globals.css";


const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: 'Tifo Market',
  description: 'Rep the culture. Wear the identity.',
  icons: {
    icon: '/images/Logo-Tab.PNG',
  },
  openGraph: {
    title: 'Tifo Market',
    description: 'Rep the culture. Wear the identity.',
    url: 'https://www.dallastifomarket.com',
    siteName: 'Tifo Market',
    images: [
      {
        url: '/images/Logo-Meta.PNG',
        width: 1200,
        height: 630,
        alt: 'Tifo Market',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tifo Market',
    description: 'Rep the culture. Wear the identity.',
    images: ['/images/Logo-Meta.PNG'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${barlow.variable} antialiased`}
        >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
