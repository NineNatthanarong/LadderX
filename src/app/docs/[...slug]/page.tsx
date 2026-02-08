'use client';

import { useEffect, useState } from 'react';
import { DocViewer } from '@/components/features/DocViewer';
import { loadSearchIndex } from '@/lib/data-loader';
import { SearchIndexItem } from '@/lib/types';
import Link from 'next/link';
import { use } from 'react';

import { Header } from '@/components/layout/Header';

export default function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = use(params);
  const docId = slug[0];

  return <ClientDocPage docId={docId} />;
}

function ClientDocPage({ docId }: { docId: string }) {
  const [doc, setDoc] = useState<SearchIndexItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoc() {
      const index = await loadSearchIndex();
      const found = index.find(item => item.documentId === docId);
      setDoc(found || null);
      setLoading(false);
    }
    fetchDoc();
  }, [docId]);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header breadcrumbs={[{ label: 'Loading...' }]} />
        <div className="p-8 text-center text-muted uppercase tracking-wider text-sm">Loading document...</div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex flex-col h-full">
        <Header breadcrumbs={[{ label: 'Not Found' }]} />
        <div className="p-8 text-center">
          <h1 className="text-xl font-black text-foreground mb-2 uppercase tracking-wide">Document Not Found</h1>
          <p className="text-muted mb-4">The document you requested could not be found.</p>
          <Link href="/" className="text-accent hover:text-accent-hover font-bold uppercase tracking-wider text-sm transition-none">
            ← Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        breadcrumbs={[
          { label: doc.category },
          { label: doc.title }
        ]}
      />
      <div className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col">
        <div className="flex-1 bg-surface border border-border overflow-hidden">
          <DocViewer url={`/api/pdf/${doc.path}`} title={doc.title} />
        </div>
      </div>
    </div>
  );
}
