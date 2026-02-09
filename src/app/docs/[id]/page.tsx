'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DocViewer } from '@/components/features/DocViewer';
import { loadSearchIndex } from '@/lib/data-loader';
import { SearchIndexItem } from '@/lib/types';

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
                    <p className="text-sm text-muted">The requested document could not be found in the index.</p>
                </div>
            </div>
        );
    }

    // Build the URL to the PDF file in /public/data/
    // The path in the index is relative to public/data/, e.g. "APPENDIX/Appendix 1 .../file.pdf"
    // We need to properly encode each path segment for the URL
    const pdfUrl = '/data/' + doc.path
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/');

    return (
        <div className="h-full flex flex-col p-4">
            <div className="mb-3">
                <h1 className="text-lg font-black text-foreground uppercase tracking-wide">{doc.title}</h1>
                <p className="text-xs text-muted uppercase tracking-wider mt-1">{doc.category}</p>
            </div>
            <div className="flex-1 min-h-0">
                <DocViewer url={pdfUrl} title={doc.title} />
            </div>
        </div>
    );
}
