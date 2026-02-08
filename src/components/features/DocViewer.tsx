'use client';

interface DocViewerProps {
  url: string;
  title: string;
}

export function DocViewer({ url, title }: DocViewerProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 bg-background border border-border overflow-hidden">
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
          className="text-xs font-bold uppercase tracking-wider text-accent hover:text-accent-hover transition-none"
        >
          Open in new tab →
        </a>
      </div>
    </div>
  );
}
