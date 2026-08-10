import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampVibe",
  description: "CampVibe organisiert Camping-, Vanlife- und Stellplätze nach Atmosphäre, Vibe und persönlicher Erfahrung.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[radial-gradient(circle_at_top,_#fef3c7,_#fff_45%)] text-zinc-900">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8">
          <header className="mb-6 flex items-center justify-between rounded-full border border-black/10 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              CampVibe
            </Link>
            <nav className="hidden items-center gap-3 text-sm text-zinc-700 sm:flex">
              <Link href="/map" className="rounded-full px-3 py-2 hover:bg-zinc-100">Karte</Link>
              <Link href="/discover" className="rounded-full px-3 py-2 hover:bg-zinc-100">Entdecken</Link>
              <Link href="/my-places" className="rounded-full px-3 py-2 hover:bg-zinc-100">Meine Plätze</Link>
            </nav>
          </header>
          {children}
        </div>
        <BottomNavigation />
      </body>
    </html>
  );
}
