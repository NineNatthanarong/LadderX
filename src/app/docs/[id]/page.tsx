'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DocViewer } from '@/components/features/DocViewer';
import { Header } from '@/components/layout/Header';
import { loadSearchIndex } from '@/lib/data-loader';
import { SearchIndexItem } from '@/lib/types';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';

export default function DocPage() {
    const params = useParams();
    const id = params.id as string;

    const [doc, setDoc] = useState<SearchIndexItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function loadDoc() {
            const index = await loadSearchIndex();
            const found = index.find((item) => item.documentId === id);
            if (found) {
                setDoc(found);
            } else {
                setNotFound(true);
            }
            setLoading(false);
        }
        loadDoc();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="inline-block w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-sm text-muted uppercase tracking-wider font-bold">Loading document…</p>
                </div>
            </div>
        );
    }

    if (notFound || !doc) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-lg font-black text-foreground uppercase tracking-wide mb-2">Document Not Found</p>
                    <p className="text-sm text-muted mb-6">The requested document could not be found in the index.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-foreground transition-all duration-200 hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, rgba(107, 5, 4, 0.3), rgba(154, 3, 30, 0.2))',
                            border: '1px solid rgba(227, 100, 20, 0.3)',
                        }}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Search
                    </Link>
                </div>
            </div>
        );
    }

    // Build breadcrumbs from category path
    const categoryParts = doc.category.split('/').filter(Boolean);
    const breadcrumbs = categoryParts.map((part) => ({ label: part }));

    // Build the URL to the PDF file in /public/data/
    const pdfUrl = '/data/' + doc.path
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/');

    return (
        <div className="h-full flex flex-col">
            {/* Document header with breadcrumbs */}
            <Header breadcrumbs={breadcrumbs} />

            {/* Document toolbar — back to search + document title */}
            <div
                className="flex items-center gap-3 px-4 lg:px-6 py-3 relative"
                style={{
                    background: 'rgba(17, 17, 17, 0.8)',
                    borderBottom: '1px solid var(--border)',
                }}
            >
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground transition-all duration-200 shrink-0 group"
                    style={{
                        background: 'rgba(227, 100, 20, 0.08)',
                        border: '1px solid rgba(227, 100, 20, 0.15)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(227, 100, 20, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(227, 100, 20, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(227, 100, 20, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(227, 100, 20, 0.15)';
                    }}
                >
                    <Search className="h-3.5 w-3.5" style={{ color: '#e36414' }} />
                    <span>Search</span>
                </Link>

                <div className="h-4 w-px bg-border shrink-0" />

                <div className="min-w-0 flex-1">
                    <h1 className="text-sm font-black text-foreground uppercase tracking-wide truncate">
                        {doc.title}
                    </h1>
                </div>
            </div>

            {/* PDF viewer */}
            <div className="flex-1 min-h-0 p-4">
                <DocViewer url={pdfUrl} title={doc.title} />
            </div>
        </div>
    );
}
