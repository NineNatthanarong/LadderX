'use client';

interface DocViewerProps {
  url: string;
  title: string;
}

export function DocViewer({ url, title }: DocViewerProps) {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/*
        For PDF iframe, we can't easily control typography inside.
        However, ensuring the container has a max-width (done in parent layout)
        improves the reading experience by not stretching lines too far on ultrawide screens.
      */}
      <div className="flex-1 relative w-full h-full min-h-[800px]">
        <iframe
          src={`${url}#view=FitH`} // Force Fit Width view mode for PDFs
          className="absolute inset-0 w-full h-full border-0"
          title={title}
          loading="lazy"
        />
      </div>
      <div className="py-2 px-4 border-t border-gray-100 bg-gray-50 flex justify-end">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          Open original PDF
        </a>
      </div>
    </div>
  );
}
