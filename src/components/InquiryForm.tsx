"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { inquiryTypes, type InquiryPayload, type InquiryType } from "@/lib/inquiry";
import { useLanguage } from "@/lib/language";

const inquiryEndpoint =
  "https://script.google.com/macros/s/AKfycbxNWxzcqD-_fKWDuySSGixtDW2aPUrgHVa2ySFzYiqMHeEv_sp2NTfCmU4hNhj_lhB4tg/exec";

type InquiryFormProps = {
  defaultType?: InquiryType;
  defaultMessage?: string;
  sourceLabel?: string;
};

type InquiryErrors = Partial<Record<keyof InquiryPayload, string>>;

const emptyPayload: InquiryPayload = {
  name: "",
  email: "",
  company: "",
  type: "Personal gift",
  quantity: "",
  timing: "",
  message: "",
  source: ""
};

function isInquiryType(value: string): value is InquiryType {
  return inquiryTypes.includes(value as InquiryType);
}

function validateInquiry(payload: InquiryPayload, t: (en: string, zh: string) => string) {
  const errors: InquiryErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!payload.name.trim()) errors.name = t("Please enter your name.", "請輸入你的姓名。");
  if (!payload.email.trim()) {
    errors.email = t("Please enter your email.", "請輸入你的電郵地址。");
  } else if (!emailPattern.test(payload.email.trim())) {
    errors.email = t("Please enter a valid email address.", "請輸入有效的電郵地址。");
  }
  if (!payload.type) errors.type = t("Please choose an inquiry type.", "請選擇查詢類型。");
  if (payload.message.trim().length < 12) {
    errors.message = t(
      "Please share a little more detail so we can respond usefully.",
      "請提供多一點詳情，讓我們能有效回覆你。"
    );
  }

  return errors;
}

const inquiryTypeLabels: Record<InquiryType, string> = {
  "Personal gift": "個人禮物",
  "Real estate settlement": "地產交收禮物",
  "Corporate gifting": "企業贈禮",
  "Partnership conversation": "合作洽談",
  "Tea recommendation": "茶推薦",
  Other: "其他"
};

export function InquiryForm({
  defaultType = "Personal gift",
  defaultMessage = "",
  sourceLabel = "Contact page"
}: InquiryFormProps) {
  const { t, language } = useLanguage();
  const [payload, setPayload] = useState<InquiryPayload>({
    ...emptyPayload,
    type: defaultType,
    message: defaultMessage,
    source: sourceLabel
  });
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const message = params.get("message");
    const source = params.get("source");

    setPayload((current) => ({
      ...current,
      type: type && isInquiryType(type) ? type : current.type,
      message: message || current.message,
      source: source || current.source
    }));
  }, []);

  const hasErrors = Object.keys(errors).length > 0;

  function updateField<Field extends keyof InquiryPayload>(field: Field, value: InquiryPayload[Field]) {
    setPayload((current) => ({ ...current, [field]: value }));
    setStatus("idle");
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    if (String(formData.get("website") ?? "").trim()) return;

    const nextErrors = validateInquiry(payload, t);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("sending");

    try {
      // Apps Script accepts a simple cross-origin form POST. no-cors keeps the visitor
      // on this page while allowing the inquiry to be delivered to the script.
      const submission = new URLSearchParams({
        name: payload.name.trim(),
        email: payload.email.trim(),
        company: payload.company.trim(),
        inquiryType: payload.type,
        quantity: payload.quantity.trim(),
        timing: payload.timing.trim(),
        message: payload.message.trim(),
        source: payload.source || sourceLabel,
        website: ""
      });

      await fetch(inquiryEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: submission.toString()
      });

      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      id="inquiry-form"
      className="grid gap-5 border border-ink/10 bg-porcelain p-5 shadow-soft md:p-8"
      noValidate
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-ink/78">
          {t("Name", "姓名")}
          <input
            name="name"
            value={payload.name}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "inquiry-name-error" : undefined}
            className="h-12 border border-ink/12 bg-white px-4 text-base outline-none transition focus:border-leaf"
            onChange={(event) => updateField("name", event.target.value)}
          />
          {errors.name ? (
            <span id="inquiry-name-error" className="text-xs font-semibold text-seal">
              {errors.name}
            </span>
          ) : null}
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink/78">
          {t("Email", "電郵")}
          <input
            name="email"
            type="email"
            value={payload.email}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "inquiry-email-error" : undefined}
            className="h-12 border border-ink/12 bg-white px-4 text-base outline-none transition focus:border-leaf"
            onChange={(event) => updateField("email", event.target.value)}
          />
          {errors.email ? (
            <span id="inquiry-email-error" className="text-xs font-semibold text-seal">
              {errors.email}
            </span>
          ) : null}
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-ink/78">
          {t("Company", "公司")}
          <input
            name="company"
            value={payload.company}
            autoComplete="organization"
            className="h-12 border border-ink/12 bg-white px-4 text-base outline-none transition focus:border-leaf"
            onChange={(event) => updateField("company", event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink/78">
          {t("Inquiry type", "查詢類型")}
          <select
            name="inquiryType"
            value={payload.type}
            aria-invalid={Boolean(errors.type)}
            className="h-12 border border-ink/12 bg-white px-4 text-base outline-none transition focus:border-leaf"
            onChange={(event) => updateField("type", event.target.value as InquiryType)}
          >
            {inquiryTypes.map((type) => (
              <option key={type} value={type}>
                {language === "zh" ? inquiryTypeLabels[type] : type}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-ink/78">
          {t("Approximate quantity", "大約數量")}
          <input
            name="quantity"
            value={payload.quantity}
            inputMode="numeric"
            className="h-12 border border-ink/12 bg-white px-4 text-base outline-none transition focus:border-leaf"
            onChange={(event) => updateField("quantity", event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink/78">
          {t("Preferred timing", "希望的時間")}
          <input
            name="timing"
            value={payload.timing}
            placeholder={t("e.g. August settlement gifts", "例如：八月交收禮物")}
            className="h-12 border border-ink/12 bg-white px-4 text-base outline-none transition focus:border-leaf"
            onChange={(event) => updateField("timing", event.target.value)}
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-ink/78">
        {t("Message", "訊息")}
        <textarea
          name="message"
          rows={5}
          value={payload.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "inquiry-message-error" : undefined}
          className="border border-ink/12 bg-white px-4 py-3 text-base outline-none transition focus:border-leaf"
          onChange={(event) => updateField("message", event.target.value)}
        />
        {errors.message ? (
          <span id="inquiry-message-error" className="text-xs font-semibold text-seal">
            {errors.message}
          </span>
        ) : null}
      </label>
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="button-primary" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <LoaderCircle className="animate-spin" size={17} /> {t("Sending…", "正在送出…")}
            </>
          ) : (
            <>
              {t("Send inquiry", "送出查詢")} <ArrowRight size={17} />
            </>
          )}
        </button>
      </div>
      <div className="grid gap-2 text-xs leading-6 text-ink/58" aria-live="polite">
        {hasErrors ? (
          <p className="font-semibold text-seal">
            {t("Please fix the highlighted fields before sending.", "請先修正標示的欄位再送出。")}
          </p>
        ) : null}
        {status === "sending" ? (
          <p className="flex max-w-xl items-start gap-2">
            <LoaderCircle className="mt-1 shrink-0 animate-spin text-leaf" size={15} />
            {t("Sending your inquiry…", "正在送出你的查詢…")}
          </p>
        ) : status === "sent" ? (
          <p className="flex max-w-xl items-start gap-2 font-semibold text-leaf">
            <CheckCircle2 className="mt-1 shrink-0" size={15} />
            {t("Thank you — your inquiry has been sent. We will be in touch soon.", "謝謝，你的查詢已成功送出。我們會盡快與你聯絡。")}
          </p>
        ) : status === "error" ? (
          <p className="font-semibold text-seal">
            {t("We could not send your inquiry. Please check your connection and try again.", "未能送出你的查詢。請檢查網絡後再試。")}
          </p>
        ) : (
          <p className="max-w-xl">
            {t(
              "Send your enquiry directly from this page. No email app will open.",
              "直接在此頁送出查詢，不會開啟電郵應用程式。"
            )}
          </p>
        )}
      </div>
    </form>
  );
}
