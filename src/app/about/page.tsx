import { Namecard } from "@/components/Namecard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Xingyu Wang — developer, maker, and creative technologist.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-16">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">About</h1>
        <div className="max-w-2xl space-y-4 leading-relaxed text-muted">
          <p>
            Hi, I&apos;m Xingyu Wang — a developer who enjoys building tools
            that make everyday life a little better. I create Chrome extensions,
            Android apps, and other side projects.
          </p>
          <p>
            This site is a home for my projects — each extension and app gets
            its own page with details, features, and links to install or learn
            more.
          </p>
          <p>
            When I&apos;m not coding, you might find me tinkering with new
            technologies, designing things, or exploring ideas for the next
            project.
          </p>
        </div>
      </div>

      {/* Namecard Section */}
      <div className="mb-16">
        <h2 className="mb-6 text-xl font-semibold tracking-tight">
          Digital Namecard
        </h2>
        <p className="mb-6 max-w-xl text-sm leading-relaxed text-muted">
          This is my original digital namecard, designed in Adobe Illustrator
          back in 2016. It&apos;s been my online presence ever since. Click it
          to flip between the front and back.
        </p>
        <Namecard />
      </div>

      {/* Contact */}
      <div className="rounded-2xl border border-border bg-surface p-8">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">
          Get in touch
        </h2>
        <div className="space-y-2 text-sm text-muted">
          <p>
            Email:{" "}
            <a
              href="mailto:hi@xingyu.wang"
              className="font-medium text-accent hover:text-accent-hover"
            >
              hi@xingyu.wang
            </a>
          </p>
          <p>
            GitHub:{" "}
            <a
              href="https://github.com/xingyuwang"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent hover:text-accent-hover"
            >
              @xingyuwang
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
