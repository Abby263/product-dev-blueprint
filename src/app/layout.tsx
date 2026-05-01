import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Product Dev Blueprint — turn any idea into a production-ready plan",
  description:
    "From a raw idea to SOW, PRD, system design, technical spec, ADRs, RTM, test strategy, launch & ops plan, GTM brief, and a coding-agent prompt pack — all generated from one canonical schema.",
};

const NO_FOUC_SCRIPT = `
(function() {
  try {
    var t = localStorage.getItem('pdb-theme');
    var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.style.colorScheme = 'light';
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FOUC_SCRIPT }} />
      </head>
      <body>
        <header className="border-b border-ink-200 dark:border-ink-800 bg-white/80 dark:bg-ink-950/80 backdrop-blur sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              <span className="inline-block w-6 h-6 rounded-md bg-accent-500" />
              Product Dev Blueprint
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/projects" className="text-ink-700 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50">Projects</Link>
              <Link href="/settings" className="text-ink-700 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50">Settings</Link>
              <ThemeToggle />
              <Link href="/projects/new" className="px-3 py-1.5 rounded-md bg-ink-900 dark:bg-ink-50 text-white dark:text-ink-900 hover:bg-ink-800 dark:hover:bg-white">
                New project
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-ink-200 dark:border-ink-800 mt-24">
          <div className="max-w-7xl mx-auto px-6 py-8 text-xs text-ink-500 dark:text-ink-500 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>Schema-first product definition.</span>
            <span>Traceable from requirement to test.</span>
            <span>Generated artifacts are drafts — human review required.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
