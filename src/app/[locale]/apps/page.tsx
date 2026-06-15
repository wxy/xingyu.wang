import { apps } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Android Apps",
};

export default async function AppsPage() {
  const t = await getTranslations("apps");
  const hasApps = apps.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-12">
        <h1 className="mb-3 font-mono text-3xl font-bold">{t("title")}</h1>
        <p className="max-w-xl text-muted">{t("subtitle")}</p>
      </div>

      {hasApps ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {apps.map((app) => (
            <ProductCard key={app.slug} product={app} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="mb-2 text-4xl">📱</p>
          <h2 className="mb-2 text-lg font-semibold">{t("empty")}</h2>
          <p className="text-sm text-muted">{t("emptyHint")} src/lib/products.ts</p>
        </div>
      )}
    </div>
  );
}
