'use client';

import { Sidebar } from "@/components/layout/Sidebar";
import { useEffect, useState } from "react";
import { loadSearchIndex } from "@/lib/data-loader";
import { buildTree, TreeNode } from "@/lib/structure";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
                    className="fixed inset-0 z-20 lg:hidden"
                    style={{ background: 'rgba(10, 10, 10, 0.85)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-30 w-[280px] sm:w-72 transform transition-transform duration-200 ease-out lg:transform-none shrink-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
                style={{
                    background: 'var(--surface)',
                    borderRight: '1px solid var(--border)',
                }}
            >
                {/* Sidebar right gradient accent */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-[1px] hidden lg:block"
                    style={{ background: 'linear-gradient(180deg, #6b0504, #9a031e, #e36414, #fb8b24)' }}
                />

                <div className="h-20 flex items-center px-4 border-b border-border">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/logo.png"
                            alt="LadderX"
                            width={180}
                            height={50}
                            className="h-11 w-auto object-contain group-hover:brightness-110 transition-all duration-200"
                            priority
                        />
                    </Link>
                    <span
                        className="ml-2 text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5"
                        style={{
                            color: '#e36414',
                            background: 'rgba(227, 100, 20, 0.1)',
                            border: '1px solid rgba(227, 100, 20, 0.2)',
                        }}
                    >
                        DOCS
                    </span>
                    <button
                        className="ml-auto lg:hidden p-1 text-muted hover:text-foreground transition-colors duration-200"
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
                <header
                    className="lg:hidden flex items-center h-14 px-4"
                    style={{
                        background: 'var(--surface)',
                        borderBottom: '1px solid var(--border)',
                    }}
                >
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open sidebar"
                        className="p-2 -ml-2 text-muted hover:text-accent transition-colors duration-200"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <Link href="/" className="ml-3 flex items-center">
                        <Image
                            src="/logo.png"
                            alt="LadderX"
                            width={100}
                            height={28}
                            className="h-6 w-auto object-contain"
                        />
                    </Link>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
