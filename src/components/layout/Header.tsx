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
    <header
      className={clsx("h-14 flex items-center px-4 lg:px-6 relative", className)}
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Bottom gradient accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, #6b0504, #9a031e, #e36414, transparent)' }}
      />

      <nav className="flex items-center text-sm text-muted overflow-hidden min-w-0">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-accent transition-colors duration-200"
          aria-label="Home"
        >
          <Home className="h-4 w-4" />
        </Link>

        {breadcrumbs.map((crumb, i) => (
          <div key={i} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-2" style={{ color: 'rgba(227, 100, 20, 0.4)' }} />
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="hover:text-accent transition-colors duration-200 font-medium"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="font-bold text-foreground line-clamp-1 max-w-[120px] sm:max-w-[200px] md:max-w-md uppercase tracking-wide text-xs">
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
}
