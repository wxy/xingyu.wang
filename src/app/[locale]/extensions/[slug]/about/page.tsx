import { getProductBySlug, localized } from "@/lib/products";
import type { Locale } from "@/lib/products";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { AboutPage } from "@/components/AboutPage";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug, "extension");
  if (!product) return { title: "Not Found" };
  return { title: `About ${product.name}` };
}

export default async function ExtensionAboutPage({ params }: Props) {
  const { slug, locale } = await params;
  const raw = getProductBySlug(slug, "extension");
  if (!raw) notFound();

  const product = localized(raw, locale as Locale);

  return (
    <AboutPage
      product={product}
      backHref={`/extensions/${slug}`}
      contactEmail="xingyu.wang@gmail.com"
    />
  );
}
