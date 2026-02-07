import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Predictor AI - Real-time Technical & Fundamental Analysis",
  description: "AI-powered stock price prediction using technical and fundamental analysis. Real-time updates every second.",
  keywords: ["stock", "prediction", "technical analysis", "fundamental analysis", "trading", "AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
