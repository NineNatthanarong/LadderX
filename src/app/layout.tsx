'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { useEffect, useState } from "react";
import { loadSearchIndex } from "@/lib/data-loader";
import { buildTree, TreeNode } from "@/lib/structure";
import { Menu, X } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadSearchIndex().then(data => {
      const treeStructure = buildTree(data);
      setTree(treeStructure);
    });
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden bg-white">
          {/* Mobile sidebar overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/50 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`
              fixed lg:static inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out lg:transform-none
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
              <span className="text-lg font-bold text-gray-900">SyntaxDocs</span>
              <button
                className="ml-auto lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <Sidebar tree={tree} />
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center h-16 px-4 border-b border-gray-200 bg-white">
              <button
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open sidebar"
                className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md"
              >
                <Menu className="h-6 w-6" />
              </button>
              <span className="ml-4 text-lg font-bold text-gray-900">SyntaxDocs</span>
            </header>

            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
