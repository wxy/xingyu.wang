import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

export default function Home() {
  const featured = getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="px-6 pb-16 pt-20 sm:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Xingyu Wang
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-balance text-lg leading-relaxed text-muted">
            I build Chrome extensions, Android apps, and tools that make life
            easier. Here&apos;s a collection of my work.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/extensions"
              className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Browse Extensions
            </Link>
            <Link
              href="/apps"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
            >
              Browse Apps
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">
              Featured projects
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Getting Started Hint */}
      <section className="border-t border-border px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto max-w-lg rounded-2xl border border-border bg-surface p-8">
            <h3 className="mb-3 text-lg font-semibold">Add your projects</h3>
            <p className="mb-4 text-sm leading-relaxed text-muted">
              Edit{" "}
              <code className="rounded bg-background px-1.5 py-0.5 text-xs">
                src/lib/products.ts
              </code>{" "}
              to add your Chrome extensions, Android apps, and other projects.
              Each product gets its own page automatically.
            </p>
            <a
              href="https://vercel.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent hover:text-accent-hover"
            >
              Deploy to Vercel →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
