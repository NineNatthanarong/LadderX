'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { Search, FileText } from 'lucide-react';
import { useSearch } from '@/hooks/use-search';
import { useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { query, setQuery, results } = useSearch();

  // Toggle with Cmd+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      {/* Trigger Button (Desktop) */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-md transition-colors w-64 justify-between"
      >
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <span>Search...</span>
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 font-mono text-[10px] font-medium text-gray-500 opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Trigger Icon (Mobile) */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md"
      >
        <Search className="w-5 h-5" />
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Search"
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4 pt-[20vh] flex justify-center items-start animate-in fade-in-0"
      >
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95">
          <div className="flex items-center border-b border-gray-100 px-3" cmdk-input-wrapper="">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search documentation..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-2 scroll-py-2">
            <Command.Empty className="py-6 text-center text-sm text-gray-500">
              No results found.
            </Command.Empty>

            {results.length > 0 && (
              <Command.Group heading="Documentation">
                {results.map((item) => (
                  <Command.Item
                    key={item.id}
                    onSelect={() => {
                      runCommand(() => router.push(`/docs/${item.documentId}`));
                    }}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none data-[selected=true]:bg-gray-100 data-[selected=true]:text-gray-900"
                  >
                    <FileText className="mr-3 h-4 w-4 text-gray-400" />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{item.title}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        {item.category}
                      </span>
                    </div>
                    {/* Breadcrumbs / Context Snippet logic could go here */}
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </div>
      </Command.Dialog>
    </>
  );
}
