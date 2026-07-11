"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/language";

// /tea-assessment and /tea-test used to render the identical quiz component under two
// separate URLs. /tea-test is the canonical route (it's what every nav link, CTA, and
// footer link on the site already points to), so this route now redirects there instead
// of duplicating the experience.
export default function TeaAssessmentPage() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    router.replace("/tea-test/");
  }, [router]);

  return (
    <main className="section">
      <div className="container text-center">
        <p className="text-sm text-ink/60">
          {t("This page has moved. Redirecting to", "此頁面已搬移，正在重新導向至")}{" "}
          <Link href="/tea-test/" className="underline">
            {t("the Tea Test", "茶測試")}
          </Link>
          ...
        </p>
      </div>
    </main>
  );
}
