'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronDown, FileText, Folder } from 'lucide-react';
import { TreeNode } from '@/lib/structure';
import { clsx } from 'clsx';

interface SidebarProps {
  tree: TreeNode[];
}

function SidebarItem({ node, level }: { node: TreeNode; level: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = node.type === 'document' && pathname === `/docs/${node.path}`;

  useEffect(() => {
    if (node.children.some(child => pathname === `/docs/${child.path}`)) {
      setIsOpen(true);
    }
  }, [pathname, node.children]);

  if (node.type === 'category') {
    return (
      <div className="select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className={clsx(
            "flex items-center w-full px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground hover:bg-surface-hover transition-none",
            level > 0 && "ml-3"
          )}
        >
          {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5 mr-1.5 text-accent" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-muted" />
          )}
          <Folder className="h-3.5 w-3.5 mr-2 text-accent/60" />
          <span className="truncate">{node.name}</span>
        </button>
        {isOpen && (
          <div className="ml-4 border-l border-border">
            {node.children.map((child, i) => (
              <SidebarItem key={`${child.name}-${i}`} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={`/docs/${node.path}`}
      className={clsx(
        "flex items-center px-3 py-1.5 text-sm transition-none",
        isActive
          ? "bg-accent/10 text-accent font-bold border-l-2 border-accent -ml-px"
          : "text-muted hover:text-foreground hover:bg-surface-hover",
        level > 0 && "ml-5"
      )}
    >
      <FileText className={clsx("h-3.5 w-3.5 mr-2 shrink-0", isActive ? "text-accent" : "text-muted/50")} />
      <span className="truncate">{node.name}</span>
    </Link>
  );
}

export function Sidebar({ tree }: SidebarProps) {
  return (
    <nav className="h-[calc(100%-3.5rem)] overflow-y-auto py-4 px-1 space-y-0.5">
      {tree.map((node, i) => (
        <SidebarItem key={`${node.name}-${i}`} node={node} level={0} />
      ))}
    </nav>
  );
}
