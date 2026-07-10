import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-32">
      <div className="text-center">
        <p className="mb-4 font-mono text-8xl text-accent">404</p>
        <h1 className="mb-3 text-xl font-semibold">Page not found</h1>
        <p className="mb-6 text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-block rounded-lg border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent transition-all hover:bg-accent/20"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
