import { apps } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Android Apps",
  description: "Android apps built by Xingyu Wang.",
};

export default function AppsPage() {
  const hasApps = apps.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-12">
        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          Android Apps
        </h1>
        <p className="max-w-xl text-balance leading-relaxed text-muted">
          Android applications I&apos;ve built — from productivity tools to
          little utilities that scratch my own itch.
        </p>
      </div>

      {hasApps ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <ProductCard key={app.slug} product={app} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <p className="mb-2 text-4xl">📱</p>
          <h2 className="mb-2 text-lg font-semibold">No apps yet</h2>
          <p className="text-sm text-muted">
            Add your Android apps to{" "}
            <code className="rounded bg-background px-1.5 py-0.5 text-xs">
              src/lib/products.ts
            </code>
          </p>
        </div>
      )}
    </div>
  );
}
