"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, ClipboardCopy, MailCheck } from "lucide-react";
import {
  buildInquiryEmailBody,
  buildInquiryMailto,
  inquiryTypes,
  type InquiryPayload,
  type InquiryType
} from "@/lib/inquiry";
import { site } from "@/lib/site";
import { useLanguage } from "@/lib/language";

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

function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);

  return Promise.resolve();
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
  const [status, setStatus] = useState<"idle" | "opening" | "copied">("idle");

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

  const emailBody = useMemo(() => buildInquiryEmailBody(payload), [payload]);
  const mailtoHref = useMemo(() => buildInquiryMailto(payload), [payload]);
  const hasErrors = Object.keys(errors).length > 0;

  function updateField<Field extends keyof InquiryPayload>(field: Field, value: InquiryPayload[Field]) {
    setPayload((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    if (String(formData.get("website") ?? "").trim()) return;

    const nextErrors = validateInquiry(payload, t);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("opening");
    window.location.href = mailtoHref;
  }

  async function handleCopy() {
    await copyToClipboard(`${emailBody}\n\nSend to: ${site.email}`);
    setStatus("copied");
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
            name="type"
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
        <button type="submit" className="button-primary">
          {t("Send inquiry", "送出查詢")} <ArrowRight size={17} />
        </button>
        <button type="button" className="button-secondary" onClick={handleCopy}>
          {t("Copy inquiry", "複製查詢內容")} <ClipboardCopy size={17} />
        </button>
      </div>
      <div className="grid gap-2 text-xs leading-6 text-ink/58" aria-live="polite">
        {hasErrors ? (
          <p className="font-semibold text-seal">
            {t("Please fix the highlighted fields before sending.", "請先修正標示的欄位再送出。")}
          </p>
        ) : null}
        {status === "opening" ? (
          <p className="flex max-w-xl items-start gap-2">
            <MailCheck className="mt-1 shrink-0 text-leaf" size={15} />
            {t("Your email app should open with the inquiry ready to send. If it does not, use Copy inquiry and send it to", "你的電郵應用程式將會開啟並準備好查詢內容。如果沒有，請使用「複製查詢內容」並寄送至")}{" "}
            <a className="font-semibold text-leaf underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        ) : status === "copied" ? (
          <p>
            {t("Inquiry copied. Send it to", "查詢內容已複製，請寄送至")}{" "}
            <a className="font-semibold text-leaf underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        ) : (
          <p className="max-w-xl">
            {t(
              "This GitHub Pages friendly form opens your email app with the inquiry prepared. You can also copy the inquiry if your browser blocks mail links.",
              "這個表單適用於 GitHub Pages，會為你開啟電郵應用程式並準備好查詢內容。如果瀏覽器封鎖了電郵連結，你也可以直接複製查詢內容。"
            )}
          </p>
        )}
      </div>
    </form>
  );
}
