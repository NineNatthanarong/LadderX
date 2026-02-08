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

  // Check if active
  const isActive = node.type === 'document' && pathname === `/docs/${node.path}`;

  // Auto-expand if child is active (simple check, recursive would be better for deep trees)
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
            "flex items-center w-full px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors",
            level > 0 && "ml-3"
          )}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4 mr-1 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1 text-gray-400" />
          )}
          <Folder className="h-4 w-4 mr-2 text-blue-500/70" />
          <span className="truncate">{node.name}</span>
        </button>
        {isOpen && (
          <div className="pl-2 border-l border-gray-100 ml-4 mt-1 space-y-0.5">
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
        "flex items-center px-2 py-1.5 text-sm rounded-md transition-colors mb-0.5",
        isActive
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        level > 0 && "ml-6"
      )}
    >
      <FileText className={clsx("h-3.5 w-3.5 mr-2", isActive ? "text-blue-600" : "text-gray-400")} />
      <span className="truncate">{node.name}</span>
    </Link>
  );
}

export function Sidebar({ tree }: SidebarProps) {
  return (
    <nav className="h-full overflow-y-auto py-6 px-3 space-y-1">
      {tree.map((node, i) => (
        <SidebarItem key={`${node.name}-${i}`} node={node} level={0} />
      ))}
    </nav>
  );
}
