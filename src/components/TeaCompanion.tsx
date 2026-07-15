"use client";

import Link from "next/link";
import { ArrowRight, Gift, Leaf, MessageCircle, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";

const endpoint = "https://script.google.com/macros/s/AKfycbxNWxzcqD-_fKWDuySSGixtDW2aPUrgHVa2ySFzYiqMHeEv_sp2NTfCmU4hNhj_lhB4tg/exec";

const paths = {
  teaTest: "/tea-test",
  ritual: "/tea-ritual",
  gift: "/gift-box",
  contact: "/contact"
};

type ChatResponse = {
  ok?: boolean;
  answer?: string;
  error?: string;
  retryAfter?: number;
};

function getVisitorId() {
  const key = "chazen-cha-visitor";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const created = `cha_${Date.now()}_${Math.random().toString(36).slice(2)}_${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(key, created);
  return created;
}

function askCha(message: string, visitorId: string) {
  return new Promise<ChatResponse>((resolve) => {
    const callback = `chazenChaReply_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const url = new URL(endpoint);
    url.search = new URLSearchParams({ action: "chat", message, visitorId, callback }).toString();
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => finish({ error: "timeout" }), 18_000);

    function finish(result?: ChatResponse) {
      window.clearTimeout(timeout);
      delete (window as unknown as Record<string, unknown>)[callback];
      script.remove();
      if (result) resolve(result);
      else resolve({ error: "connection" });
    }

    (window as unknown as Record<string, unknown>)[callback] = (result: ChatResponse) => finish(result);
    script.onerror = () => finish({ error: "connection" });
    script.src = url.toString();
    document.body.appendChild(script);
  });
}

export function TeaCompanion() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [visitorId, setVisitorId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "thinking" | "error">("idle");

  useEffect(() => setVisitorId(getVisitorId()), []);

  const onTest = pathname?.includes("tea-test");
  const onContact = pathname?.includes("contact");
  const greeting = onTest
    ? t("Take your time. I can help with your tea match after the test.", "慢慢來。完成測試後，我可以幫你了解茶葉配對。")
    : onContact
      ? t("Need a little direction before you enquire? Ask me anything about Chazen.", "查詢前想先了解多一點嗎？你可以問我任何關於 Chazen 的問題。")
      : t("Hello, I’m Cha — your quiet tea companion. What would you like to know?", "你好，我是茶，一位安靜的茶友。你想了解甚麼？");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = question.trim();
    if (!message || !visitorId || status === "thinking") return;

    setStatus("thinking");
    setAnswer("");
    try {
      const result = await askCha(message, visitorId);
      if (result.ok && result.answer) {
        setAnswer(result.answer);
        setQuestion("");
        setStatus("idle");
        return;
      }

      if (result.retryAfter) {
        setAnswer(t(`Please wait about ${result.retryAfter} seconds before asking again.`, `請約等 ${result.retryAfter} 秒後再提問。`));
      } else if (result.error === "limit") {
        setAnswer(t("Cha is resting for today. Please return tomorrow.", "茶今天已經休息，請明天再來。"));
      } else {
        setAnswer(t("Cha is not available just now. Please try again shortly.", "茶暫時未能回覆，請稍後再試。"));
      }
      setStatus("error");
    } catch {
      setAnswer(t("Cha is not available just now. Please try again shortly.", "茶暫時未能回覆，請稍後再試。"));
      setStatus("error");
    }
  }

  return (
    <aside className="fixed bottom-5 right-5 z-[70] grid justify-items-end gap-3 max-sm:bottom-3.5 max-sm:right-3.5" aria-label={t("Chazen tea guide", "Chazen 茶導覽員")}>
      {open ? (
        <section className="w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl border border-[#5b3a24]/20 bg-[#fffcf5] p-4 text-[#2a2722] shadow-[0_18px_44px_rgba(23,23,19,0.22)]" aria-live="polite">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[50%_50%_46%_46%] bg-[#d1a956] text-[#173225]" aria-hidden="true"><Leaf size={18} /></div>
            <div><strong className="block font-[var(--font-serif)] text-[1.35rem] leading-none">Cha</strong><span className="block text-xs leading-5 text-[#2a2722]/65">{t("Tea companion", "茶友導覽員")}</span></div>
            <button type="button" className="grid h-8 w-8 place-items-center rounded-full text-[#2a2722]/55 hover:bg-[#b9823a]/10 hover:text-[#6f4a32] focus-visible:bg-[#b9823a]/10 focus-visible:outline-none" onClick={() => setOpen(false)} aria-label={t("Close tea guide", "關閉茶導覽員")}><X size={16} /></button>
          </div>
          <p className="my-3 text-sm leading-6 text-[#2a2722]/75">{answer || greeting}</p>
          <form onSubmit={handleSubmit} className="grid gap-2">
            <label className="sr-only" htmlFor="cha-question">{t("Ask Cha", "問茶")}</label>
            <textarea id="cha-question" value={question} maxLength={600} rows={2} placeholder={t("Ask about tea, gifts, or rituals…", "問茶葉、禮物或茶儀式…")} onChange={(event) => setQuestion(event.target.value)} className="w-full resize-none rounded-xl border border-[#5b3a24]/20 bg-white px-3 py-2 text-sm leading-5 outline-none focus:border-[#1f4735]" />
            <button type="submit" disabled={!question.trim() || status === "thinking"} className="flex items-center justify-center gap-2 rounded-xl bg-[#1f4735] px-3 py-2.5 text-sm font-bold text-[#fbf7ef] disabled:cursor-not-allowed disabled:opacity-50">
              <ArrowRight size={15} /> {status === "thinking" ? t("Thinking…", "思考中…") : t("Ask Cha", "問茶")}
            </button>
          </form>
          <p className="mt-2 text-[0.68rem] leading-4 text-[#2a2722]/55">{t("Short questions work best. Messages are limited to protect this service.", "簡短問題最合適。為保護服務，訊息設有上限。")}</p>
          <div className="mt-3 grid gap-2">
            <Link href={paths.teaTest} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-[0.6rem] bg-[#f3ebdf] px-3 py-2 text-[0.78rem] font-bold text-[#284a38]"><Sparkles size={14} /> {t("Find my tea", "找適合我的茶")}</Link>
            <Link href={paths.gift} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-[0.6rem] bg-[#f3ebdf] px-3 py-2 text-[0.78rem] font-bold text-[#284a38]"><Gift size={14} /> {t("Choose a gift", "挑選禮物")}</Link>
            <Link href={onContact ? paths.ritual : paths.contact} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-[0.6rem] bg-[#f3ebdf] px-3 py-2 text-[0.78rem] font-bold text-[#284a38]"><MessageCircle size={14} /> {onContact ? t("Explore a ritual", "探索茶儀式") : t("Ask Chazen", "聯絡 Chazen")}</Link>
          </div>
        </section>
      ) : null}
      <button type="button" className="relative inline-flex min-h-[3.3rem] items-center gap-2 rounded-full border border-white/45 bg-[#1f4735] py-1.5 pl-1.5 pr-3 text-[#fbf7ef] shadow-[0_12px_28px_rgba(23,23,19,0.22)] transition hover:-translate-y-0.5 hover:bg-[#285942] focus-visible:-translate-y-0.5 focus-visible:bg-[#285942] focus-visible:outline-none" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={open ? t("Close Cha", "關閉茶") : t("Open Cha, your tea guide", "開啟茶導覽員")}>
        <span className="absolute -top-2 left-4 h-4 w-3 rotate-[15deg] rounded-full border-l border-[#d1a956]/85" aria-hidden="true" />
        <span className="grid h-10 w-10 place-items-center rounded-[50%_50%_46%_46%] bg-[#d1a956] text-[#173225]" aria-hidden="true"><Leaf size={18} /></span><span className="text-sm font-extrabold tracking-[0.04em]">Cha</span>
      </button>
    </aside>
  );
}
