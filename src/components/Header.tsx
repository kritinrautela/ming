import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
import { navItems, site } from "@/lib/site";

export function Header() {
  return (
    <header className="site-header">
      <div className="container flex h-16 items-center justify-between gap-5">
        <Link href="/" className="display-title text-xl text-porcelain" aria-label="Chazen home">
          {site.name}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-porcelain/68 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item.href === "/tea-test" ? "nav-tea-test-pill" : "transition hover:text-porcelain"}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/tea-test" className="header-inquire button-light">
            Start Tea Test
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
