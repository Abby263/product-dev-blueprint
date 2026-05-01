import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product Dev Blueprint — structured discovery to traceable artifacts",
  description:
    "Turn an idea into a complete, reviewable, implementation-ready package: PRD, SOW, technical spec, ADRs, RTM, test strategy, launch & ops plan, and marketing brief — all from one canonical project schema.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-ink-200 bg-white/80 backdrop-blur sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="inline-block w-6 h-6 rounded-md bg-accent-500" />
              Product Dev Blueprint
            </Link>
            <nav className="flex items-center gap-5 text-sm">
              <Link href="/projects" className="text-ink-700 hover:text-ink-900">Projects</Link>
              <Link href="/settings" className="text-ink-700 hover:text-ink-900">Settings</Link>
              <Link href="/projects/new" className="px-3 py-1.5 rounded-md bg-ink-900 text-white hover:bg-ink-800">
                New project
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-ink-200 mt-24">
          <div className="max-w-7xl mx-auto px-6 py-8 text-xs text-ink-500 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>Schema-first product definition.</span>
            <span>Traceable from requirement to test.</span>
            <span>Generated artifacts are drafts — human review required.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
