"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import type { Product, Platform } from "@/lib/products";

interface PrivacySection {
  title: string;
  content: string;
}

interface PrivacyPageProps {
  product: Product;
  backHref: string;
  platform: Platform;
  contactEmail: string;
}

const EXTENSION_SECTIONS: PrivacySection[] = [
  {
    title: "dataCollection",
    content: "AI Pulse does not collect, store, or transmit any personal information. All API keys are stored locally in chrome.storage.local and never sent anywhere except to the respective AI provider's API for balance queries.",
  },
  {
    title: "apiKeys",
    content: "API keys are stored in chrome.storage.local, which is Chrome's built-in encrypted local storage. They are only sent to the corresponding AI provider's API endpoint when you have configured that provider. Keys are never transmitted to us or any third party.",
  },
  {
    title: "networkRequests",
    content: "The extension makes HTTPS requests to AI provider APIs (DeepSeek, OpenAI, Kimi, Zhipu, etc.) solely to fetch balance and usage data on your behalf. No analytics, no tracking, no telemetry of any kind.",
  },
  {
    title: "permissions",
    content: "The extension requests the following Chrome permissions: storage (to save your settings and API keys locally), alarms (to schedule periodic balance refresh), and notifications (to alert you of spending anomalies). It does not access browsing history, cookies, or page content.",
  },
  {
    title: "thirdParty",
    content: "You configure your own API keys for third-party AI providers. AI Pulse is not responsible for those providers' privacy practices. Please refer to their respective privacy policies.",
  },
];

const APP_SECTIONS: PrivacySection[] = [
  {
    title: "dataCollection",
    content: "AI Pulse processes all data locally on your Mac. No usage data, code content, prompts, diffs, or personal information ever leaves your machine. Everything stays on your device.",
  },
  {
    title: "apiKeys",
    content: "API keys are stored in the macOS Keychain with sandboxed access. They are only used to query AI provider balance APIs (DeepSeek, OpenAI, Kimi, Zhipu) when you configure them. Keys are never transmitted elsewhere.",
  },
  {
    title: "fileAccess",
    content: "AI Pulse reads Claude Code logs (~/.claude/), aider history (.llm.history) for token usage estimation, and .git/objects for code change tracking. All reading is local; nothing is uploaded or transmitted.",
  },
  {
    title: "networkRequests",
    content: "Network requests are made only to AI provider balance APIs when you configure API keys. No analytics, no crash reporting, no telemetry of any kind.",
  },
  {
    title: "appSandbox",
    content: "AI Pulse is distributed via the Mac App Store with App Sandbox enabled. Entitlements are limited to: network.client (outbound HTTPS for balance queries) and files.user-selected.read-only (for selecting repositories to track).",
  },
  {
    title: "thirdParty",
    content: "You provide your own API keys for third-party AI providers. AI Pulse is not responsible for those providers' privacy practices. Please refer to their respective privacy policies.",
  },
];

export function PrivacyPage({ product, backHref, platform, contactEmail }: PrivacyPageProps) {
  const t = useTranslations("productPage");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tt = t as any as (key: string) => string;
  const sections = platform === "chrome" ? EXTENSION_SECTIONS : APP_SECTIONS;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Back link */}
      <nav className="mb-8">
        <Link href={backHref} className="text-sm text-muted transition-colors hover:text-accent">
          {t("backToProduct", { product: product.name })}
        </Link>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-2 font-mono text-3xl font-bold">
          {product.name} {t("privacyTitle")}
        </h1>
        <p className="text-sm text-muted">{t("lastUpdated", { date: "2026-07-01" })}</p>
      </div>

      {/* Intro */}
      <div className="card mb-8 p-6">
        <p className="leading-relaxed text-muted">
          {platform === "chrome"
            ? "This privacy policy applies to the AI Pulse Chrome Extension."
            : "This privacy policy applies to AI Pulse for macOS."}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="card p-6">
            <h2 className="mb-3 text-lg font-semibold">
              {tt(section.title)}
            </h2>
            <p className="leading-relaxed text-muted">{section.content}</p>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="mt-12 card p-6">
        <h2 className="mb-3 text-lg font-semibold">{t("contact")}</h2>
        <p className="text-sm text-muted">
          {t("privacyContact")}{" "}
          <a href={`mailto:${contactEmail}`} className="text-accent hover:opacity-80">
            {contactEmail}
          </a>
        </p>
      </div>
    </div>
  );
}
