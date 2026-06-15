import Link from "next/link";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const href =
    product.type === "extension"
      ? `/extensions/${product.slug}`
      : `/apps/${product.slug}`;

  return (
    <Link
      href={href}
      className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="text-3xl" role="img" aria-hidden>
          {product.icon}
        </span>
        <span className="rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-muted">
          {product.type === "extension" ? "Extension" : "App"}
        </span>
      </div>
      <h3 className="mb-1.5 text-lg font-semibold text-foreground">
        {product.name}
      </h3>
      <p className="mb-3 text-sm leading-relaxed text-muted">
        {product.tagline}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {product.technologies.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="rounded-md bg-background px-2 py-0.5 text-xs text-muted"
          >
            {tech}
          </span>
        ))}
      </div>
    </Link>
  );
}
