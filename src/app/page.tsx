import { getFeaturedProducts, achievements } from "@/lib/products";
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

      {/* Chrome Extensions */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Chrome Extensions
            </h2>
            <Link
              href="/extensions"
              className="text-sm font-medium text-accent hover:text-accent-hover"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured
              .filter((p) => p.type === "extension")
              .map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
          </div>
        </div>
      </section>

      {/* Android Apps */}
      <section className="border-t border-border px-6 pb-20 pt-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Android Apps
            </h2>
            <Link
              href="/apps"
              className="text-sm font-medium text-accent hover:text-accent-hover"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured
              .filter((p) => p.type === "app")
              .map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      {achievements.length > 0 && (
        <section className="border-t border-border px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">
              Achievements
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {achievements.map((ach) => (
                <a
                  key={ach.name}
                  href={ach.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-2xl" aria-hidden>
                      {ach.icon}
                    </span>
                    <span className="rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-muted">
                      {ach.org}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {ach.name}
                  </h3>
                  <p className="mb-3 text-sm leading-relaxed text-muted">
                    {ach.description}
                  </p>
                  <p className="text-xs text-muted">{ach.year}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
