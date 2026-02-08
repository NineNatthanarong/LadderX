'use client';

import Link from 'next/link';
import { ChevronLeft, Home, ChevronRight } from 'lucide-react';
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
    <header className={clsx("h-16 flex items-center border-b border-gray-200 bg-white px-4 lg:px-6", className)}>
      <nav className="flex items-center text-sm text-gray-500">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-gray-900 transition-colors"
          aria-label="Home"
        >
          <Home className="h-4 w-4" />
        </Link>

        {breadcrumbs.map((crumb, i) => (
          <div key={i} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-2 text-gray-300" />
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="hover:text-gray-900 transition-colors font-medium"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="font-semibold text-gray-900 line-clamp-1 max-w-[200px] sm:max-w-md">
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
}
