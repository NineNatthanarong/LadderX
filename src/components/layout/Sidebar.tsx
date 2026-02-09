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
            "flex items-center w-full px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-200",
            level > 0 && "ml-3"
          )}
          style={{
            color: isOpen ? '#e36414' : '#737373',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#fafafa';
            e.currentTarget.style.background = 'rgba(227, 100, 20, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = isOpen ? '#e36414' : '#737373';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5 mr-1.5" style={{ color: '#e36414' }} />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 mr-1.5" style={{ color: '#737373' }} />
          )}
          <Folder className="h-3.5 w-3.5 mr-2" style={{ color: isOpen ? '#e36414' : 'rgba(227, 100, 20, 0.4)' }} />
          <span className="truncate">{node.name}</span>
        </button>
        {isOpen && (
          <div
            className="ml-4"
            style={{ borderLeft: '1px solid rgba(227, 100, 20, 0.15)' }}
          >
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
        "flex items-center px-3 py-1.5 text-sm transition-colors duration-200",
        level > 0 && "ml-5"
      )}
      style={
        isActive
          ? {
            background: 'rgba(227, 100, 20, 0.08)',
            color: '#e36414',
            fontWeight: 700,
            borderLeft: '2px solid #e36414',
            marginLeft: level > 0 ? '1.25rem' : '-1px',
          }
          : {
            color: '#737373',
          }
      }
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = '#fafafa';
          e.currentTarget.style.background = 'rgba(227, 100, 20, 0.04)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = '#737373';
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      <FileText
        className="h-3.5 w-3.5 mr-2 shrink-0"
        style={{ color: isActive ? '#e36414' : 'rgba(115, 115, 115, 0.5)' }}
      />
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
