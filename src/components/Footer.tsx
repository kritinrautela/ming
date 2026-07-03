import Link from "next/link";
import { footerItems, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="museum-site-footer">
      <div className="container">
        <div className="museum-footer-brand">
          <p className="display-title">{site.name}</p>
          <h2>Tea. Return. Stillness.</h2>
          <p>
            A modern cultural tea house for ritual, origin, stillness, and meaningful gifts.
          </p>
        </div>
        <div className="museum-footer-grid">
          <div>
            <p>Explore</p>
            {footerItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <p>Signature Focus</p>
            <span>AI tea state test</span>
            <span>Gaiwan ritual</span>
            <span>Chinese tea culture</span>
            <span>Jian Zhan five cups</span>
            <span>Cultural gifting</span>
          </div>
          <div>
            <p>Contact</p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <Link href="/b2b">
              Private cultural gifting inquiry
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
