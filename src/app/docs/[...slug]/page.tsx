'use client';

import { useEffect, useState, use } from 'react';
import { DocViewer } from '@/components/features/DocViewer';
import { loadSearchIndex } from '@/lib/data-loader';
import { SearchIndexItem } from '@/lib/types';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { TableOfContents } from '@/components/features/TableOfContents';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = use(params);
  const docId = slug[0];
  return <ClientDocPage docId={docId} />;
}

function ClientDocPage({ docId }: { docId: string }) {
  const [doc, setDoc] = useState<SearchIndexItem | null>(null);
  const [prevDoc, setPrevDoc] = useState<SearchIndexItem | null>(null);
  const [nextDoc, setNextDoc] = useState<SearchIndexItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoc() {
      const index = await loadSearchIndex();
      const currentIndex = index.findIndex(item => item.documentId === docId);

      if (currentIndex !== -1) {
        setDoc(index[currentIndex]);
        setPrevDoc(index[currentIndex - 1] || null);
        setNextDoc(index[currentIndex + 1] || null);
      } else {
        setDoc(null);
      }
      setLoading(false);
    }
    fetchDoc();
  }, [docId]);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white">
        <Header breadcrumbs={[{ label: 'Loading...' }]} />
        <div className="flex-1 flex items-center justify-center text-muted-foreground animate-pulse">
          Loading document...
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex flex-col h-full bg-white">
        <Header breadcrumbs={[{ label: 'Not Found' }]} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Document Not Found</h1>
          <p className="text-muted-foreground mb-6">The document you requested could not be found.</p>
          <Link
            href="/"
            className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Placeholder headings for TOC - in a real app with Markdown, we'd parse these
  // Since we use PDFs, we might need a different strategy or manual metadata
  const headings: { id: string; text: string; level: number }[] = [];

  return (
    <div className="flex flex-col h-full bg-background">
      <Header
        breadcrumbs={[
          { label: doc.category },
          { label: doc.title }
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content Column */}
            <main className="lg:col-span-9 flex flex-col space-y-8">
              <div className="prose prose-gray max-w-none">
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                  {doc.title}
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden min-h-[800px]">
                  <DocViewer url={`/api/pdf/${doc.path}`} title={doc.title} />
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-8 border-t border-border mt-8">
                {prevDoc ? (
                  <Link
                    href={`/docs/${prevDoc.documentId}`}
                    className="flex flex-col group"
                  >
                    <span className="text-sm text-muted-foreground mb-1 flex items-center group-hover:text-foreground transition-colors">
                      <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                    </span>
                    <span className="text-lg font-medium text-blue-600 group-hover:underline">
                      {prevDoc.title}
                    </span>
                  </Link>
                ) : <div />}

                {nextDoc ? (
                  <Link
                    href={`/docs/${nextDoc.documentId}`}
                    className="flex flex-col items-end group"
                  >
                    <span className="text-sm text-muted-foreground mb-1 flex items-center group-hover:text-foreground transition-colors">
                      Next <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                    <span className="text-lg font-medium text-blue-600 group-hover:underline">
                      {nextDoc.title}
                    </span>
                  </Link>
                ) : <div />}
              </div>
            </main>

            {/* Sticky TOC Column */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-8">
                <TableOfContents headings={headings} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
