'use client';

interface DocViewerProps {
  url: string;
  title: string;
}

export function DocViewer({ url, title }: DocViewerProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <div
        className="flex-1 overflow-hidden relative"
        style={{
          background: 'var(--background)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Top gradient accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10"
          style={{ background: 'var(--gradient-brand-h)' }}
        />
        <iframe
          src={url}
          className="w-full h-full"
          title={title}
          allowFullScreen
        />
      </div>
      <div className="mt-3 text-right">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold uppercase tracking-wider transition-colors duration-200"
          style={{ color: '#e36414' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fb8b24'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#e36414'; }}
        >
          Open in new tab →
        </a>
      </div>
    </div>
  );
}
