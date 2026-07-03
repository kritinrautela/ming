"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav relative lg:hidden">
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-porcelain/16 text-porcelain transition hover:bg-porcelain/10"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      {open ? (
        <div
          id="mobile-navigation"
          className="absolute right-0 top-12 z-50 w-[min(82vw,320px)] border border-ink/10 bg-porcelain p-3 shadow-soft"
        >
          <div className="grid gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="min-h-12 px-4 py-3 text-sm font-semibold text-ink/72 transition hover:bg-paper hover:text-leaf"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/tea-test"
            className="mobile-menu-inquire button-primary mt-3"
            onClick={() => setOpen(false)}
          >
            Start Tea Test
          </Link>
        </div>
      ) : null}
    </div>
  );
}
