import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-32">
      <div className="text-center">
        <p className="mb-2 text-6xl">🔍</p>
        <h1 className="mb-3 text-2xl font-bold tracking-tight">
          Page not found
        </h1>
        <p className="mb-6 text-muted">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
