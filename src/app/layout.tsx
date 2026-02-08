'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { useEffect, useState } from "react";
import { loadSearchIndex } from "@/lib/data-loader";
import { buildTree, TreeNode } from "@/lib/structure";
import { NavigationProvider } from "@/components/providers/NavigationContext";
import { CommandMenu } from "@/components/features/CommandMenu";
import { ThemeToggle } from "@/components/features/ThemeToggle";
import { Menu, X } from "lucide-react";
import { useNavigation } from "@/components/providers/NavigationContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NavigationProvider>
          <AppContent>{children}</AppContent>
        </NavigationProvider>
      </body>
    </html>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useNavigation();

  useEffect(() => {
    loadSearchIndex().then(data => {
      const treeStructure = buildTree(data);
      setTree(treeStructure);
    });
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-72 transform bg-white border-r border-border transition-transform duration-200 ease-in-out lg:transform-none flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-16 flex items-center px-6 border-b border-border justify-between">
          <span className="text-lg font-bold text-foreground tracking-tight">SyntaxDocs</span>
          <button
            className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
            onClick={closeSidebar}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Search Trigger inside Sidebar (optional/redundant but good for UX) */}
        <div className="p-4 lg:hidden">
          <CommandMenu />
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <Sidebar tree={tree} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header (Mobile & Desktop Search) */}
        <header className="flex items-center h-16 px-4 border-b border-border bg-white justify-between lg:justify-end">
          <button
            onClick={toggleSidebar}
            aria-label="Open sidebar"
            className="p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-md lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-4">
            <CommandMenu />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
