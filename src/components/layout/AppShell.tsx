'use client';

import { Sidebar } from "@/components/layout/Sidebar";
import { useEffect, useState } from "react";
import { loadSearchIndex } from "@/lib/data-loader";
import { buildTree, TreeNode } from "@/lib/structure";
import { Menu, X } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
    const [tree, setTree] = useState<TreeNode[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        loadSearchIndex().then(data => {
            const treeStructure = buildTree(data);
            setTree(treeStructure);
        });
    }, []);

    return (
        <div className="flex h-screen overflow-hidden overflow-x-hidden bg-background">
            {/* Mobile sidebar overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/80 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-30 w-[280px] sm:w-72 transform bg-surface border-r border-border transition-transform duration-150 ease-out lg:transform-none shrink-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                <div className="h-14 flex items-center px-5 border-b border-border">
                    <span className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
                        LadderX
                    </span>
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-accent">
                        DOCS
                    </span>
                    <button
                        className="ml-auto lg:hidden p-1 text-muted hover:text-foreground"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <Sidebar tree={tree} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center h-14 px-4 border-b border-border bg-surface">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open sidebar"
                        className="p-2 -ml-2 text-muted hover:text-foreground"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <span className="ml-3 text-sm font-black uppercase tracking-[0.2em] text-foreground">
                        LadderX
                    </span>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
