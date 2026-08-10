"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/map", label: "Karte", icon: "◉" },
  { href: "/discover", label: "Entdecken", icon: "✦" },
  { href: "/my-places", label: "Meine Plätze", icon: "☰" },
  { href: "/profile", label: "Profil", icon: "◌" },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/90 px-2 py-2 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center rounded-2xl px-2 py-2 text-[11px] font-medium ${active ? "bg-zinc-950 text-white" : "text-zinc-600"}`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
