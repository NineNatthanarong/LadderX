'use client';

import { useTableOfContents } from '@/hooks/use-toc';
import { cn } from '@/lib/utils'; // Assuming utils exists or we use clsx directly

// Fallback if lib/utils doesn't exist yet
function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface TableOfContentsProps {
  headings: { id: string; text: string; level: number }[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const { activeId } = useTableOfContents();

  if (headings.length === 0) return null;

  return (
    <nav className="toc-nav space-y-2">
      <p className="font-semibold text-gray-900 mb-4">On this page</p>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: (heading.level - 2) * 16 }}
          >
            <a
              href={`#${heading.id}`}
              className={classNames(
                'block transition-colors duration-200',
                activeId === heading.id
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-900'
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
