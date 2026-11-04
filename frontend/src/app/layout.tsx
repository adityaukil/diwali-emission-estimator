import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diwali Air Quality & Firecracker Emission Estimator",
  description: "AI-powered environmental impact estimator for Diwali firecracker emissions. Calculates PM2.5, SO2, and air quality spikes with WHO safety comparisons.",
  keywords: ["Diwali", "Air Quality", "PM2.5", "SO2", "Firecrackers", "Emission Estimator", "Pollution", "WHO Guidelines"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className="antialiased min-h-screen bg-[#030712] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200"
      >
        {children}
      </body>
    </html>
  );
}
