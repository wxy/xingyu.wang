import { getProductId, isMetricsEnabled, type Product, type ProductType } from "@/lib/products";
import {
  getMetricsForProductSlug,
  getReleasesForProductSlug,
} from "@/lib/metrics";
import { ProductMetricsPanel } from "./ProductMetricsPanel";
import { ProductReleaseList } from "./ProductReleaseList";

interface Props {
  product: Product;
  slug: string;
  type: ProductType;
  locale: string;
}

export async function ProductMetricsSection({ product, slug, type, locale }: Props) {
  if (!isMetricsEnabled(product)) return null;

  const [metrics, releases] = await Promise.all([
    getMetricsForProductSlug(slug, type),
    getReleasesForProductSlug(slug, type),
  ]);

  if (!metrics) return null;

  const repoReleasesUrl = product.repoUrl
    ? `${product.repoUrl}/releases`
    : undefined;

  return (
    <>
      <ProductMetricsPanel metrics={metrics} locale={locale} />
      <ProductReleaseList
        releases={releases}
        locale={locale}
        activity={metrics.activity}
        repoReleasesUrl={repoReleasesUrl}
      />
    </>
  );
}

export { getProductId };
