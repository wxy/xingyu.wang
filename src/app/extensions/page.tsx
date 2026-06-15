import { extensions } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chrome Extensions",
  description: "Chrome extensions built by Xingyu Wang.",
};

export default function ExtensionsPage() {
  const hasExtensions = extensions.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-12">
        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          Chrome Extensions
        </h1>
        <p className="max-w-xl text-balance leading-relaxed text-muted">
          Browser extensions I&apos;ve built to enhance productivity, add
          features, and solve everyday problems on the web.
        </p>
      </div>

      {hasExtensions ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {extensions.map((ext) => (
            <ProductCard key={ext.slug} product={ext} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <p className="mb-2 text-4xl">🧩</p>
          <h2 className="mb-2 text-lg font-semibold">No extensions yet</h2>
          <p className="text-sm text-muted">
            Add your Chrome extensions to{" "}
            <code className="rounded bg-background px-1.5 py-0.5 text-xs">
              src/lib/products.ts
            </code>
          </p>
        </div>
      )}
    </div>
  );
}
