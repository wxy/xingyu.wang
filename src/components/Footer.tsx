export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} Xingyu Wang. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted">
          <a
            href="https://github.com/xingyuwang"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <span className="text-border">|</span>
          <a
            href="mailto:hi@xingyu.wang"
            className="transition-colors hover:text-foreground"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
