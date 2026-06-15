import { getProductBySlug, apps } from "@/lib/products";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not Found" };
  return {
    title: product.name,
    description: product.tagline,
  };
}

export default async function AppDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product || product.type !== "app") notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/apps"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← All Apps
        </Link>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <div className="mb-4 flex items-center gap-4">
          <span className="text-4xl" role="img" aria-hidden>
            {product.icon}
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="text-lg text-muted">{product.tagline}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-12">
        <h2 className="mb-3 text-lg font-semibold">About</h2>
        <p className="max-w-2xl leading-relaxed text-muted">
          {product.description}
        </p>
      </div>

      {/* Features */}
      {product.features.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-4 text-lg font-semibold">Features</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 rounded-xl border border-border p-4"
              >
                <span className="mt-0.5 flex-shrink-0 text-accent">✓</span>
                <span className="text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tech Stack */}
      <div className="mb-12">
        <h2 className="mb-3 text-lg font-semibold">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {product.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-lg bg-surface px-3 py-1.5 text-sm text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      {product.url && (
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Get it on Google Play
          <span aria-hidden>→</span>
        </a>
      )}
    </div>
  );
}
