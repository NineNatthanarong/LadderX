'use client';

import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface HeaderProps {
  breadcrumbs?: Breadcrumb[];
  className?: string;
}

export function Header({ breadcrumbs = [], className }: HeaderProps) {
  return (
    <header className={clsx("h-14 flex items-center border-b border-border bg-surface px-4 lg:px-6", className)}>
      <nav className="flex items-center text-sm text-muted">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-foreground transition-none"
          aria-label="Home"
        >
          <Home className="h-4 w-4" />
        </Link>

        {breadcrumbs.map((crumb, i) => (
          <div key={i} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-2 text-accent/50" />
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="hover:text-foreground transition-none font-medium"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="font-bold text-foreground line-clamp-1 max-w-[200px] sm:max-w-md uppercase tracking-wide text-xs">
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
}
