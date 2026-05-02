import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Product Dev Blueprint - focused idea evaluation",
  description:
    "Turn a rough app idea into a focused build-readiness report, scenario checks, MVP scope, risks, validation experiments, and developer handoff artifacts.",
  icons: {
    icon: "/icon.svg",
  },
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:h-14 sm:py-0 flex min-w-0 flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              <span className="inline-block w-6 h-6 rounded-md bg-accent-500" />
              <span className="truncate">Product Dev Blueprint</span>
            </Link>
            <div className="flex w-full max-w-full sm:w-auto flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <nav className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4 text-sm">
                <Link href="/projects" className="text-ink-700 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50">Projects</Link>
                <Link href="/settings" className="text-ink-700 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50">Settings</Link>
                <ThemeToggle />
              </nav>
              <Link href="/projects/new" className="w-full max-w-full sm:w-auto text-center px-3 py-1.5 rounded-md bg-ink-900 dark:bg-ink-50 text-white dark:text-ink-900 hover:bg-ink-800 dark:hover:bg-white">
                New project
              </Link>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-ink-200 dark:border-ink-800 mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-xs text-ink-500 dark:text-ink-500 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>Schema-first product definition.</span>
            <span>Traceable from requirement to test.</span>
            <span>Generated artifacts are drafts — human review required.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
