import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Global sans-serif font used by the application UI.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Monospace font used for code-like UI elements.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Static metadata for browser tab and SEO defaults.
export const metadata = {
  title: "Vehicle Rental App",
  description: "Vehicle rental management frontend and API",
};

// Root layout wrapper applied to all pages.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
