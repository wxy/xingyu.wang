import { getProductBySlug, localized } from "@/lib/products";
import type { Locale } from "@/lib/products";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { PrivacyPage } from "@/components/PrivacyPage";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug, "extension");
  if (!product) return { title: "Not Found" };
  return { title: `${product.name} Privacy Policy` };
}

export default async function ExtensionPrivacyPage({ params }: Props) {
  const { slug, locale } = await params;
  const raw = getProductBySlug(slug, "extension");
  if (!raw) notFound();

  const product = localized(raw, locale as Locale);

  return (
    <PrivacyPage
      product={product}
      backHref={`/extensions/${slug}`}
      platform="chrome"
      contactEmail="xingyu.wang@gmail.com"
    />
  );
}
