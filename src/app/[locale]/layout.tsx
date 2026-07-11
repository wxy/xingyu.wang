import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: "Xingyu Wang — developer & maker",
    template: "%s — xingyu.wang",
  },
  description:
    "Personal site of Xingyu Wang. Chrome extensions, Android apps, and side projects.",
  metadataBase: new URL("https://xingyu.wang"),
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><rect x='3' y='4' width='42' height='30' rx='6' fill='%23d5ccb5' stroke='%231a1a1a' stroke-width='1.5'/><rect x='8' y='9' width='32' height='20' rx='3' fill='%230d0d0d'/><rect x='10' y='11' width='28' height='16' rx='2' fill='%230a1a0a'/><line x1='10' y1='15' x2='38' y2='15' stroke='%2333ff33' stroke-width='0.5' opacity='0.3'/><line x1='10' y1='19' x2='38' y2='19' stroke='%2333ff33' stroke-width='0.5' opacity='0.3'/><line x1='10' y1='23' x2='38' y2='23' stroke='%2333ff33' stroke-width='0.5' opacity='0.3'/><rect x='12' y='6' width='3' height='1' rx='0.5' fill='%238a8070'/><rect x='17' y='6' width='3' height='1' rx='0.5' fill='%238a8070'/><rect x='22' y='6' width='3' height='1' rx='0.5' fill='%238a8070'/><rect x='27' y='6' width='3' height='1' rx='0.5' fill='%238a8070'/><rect x='32' y='6' width='3' height='1' rx='0.5' fill='%238a8070'/><circle cx='40' cy='37' r='2' fill='%2333ff33' opacity='0.9'/><rect x='14' y='35' width='20' height='2' rx='1' fill='%238a8070'/></svg>",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navigation locale={locale} />
          <main className="flex-1" style={{ maxWidth: 960, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
