'use client';

interface DocViewerProps {
  url: string;
  title: string;
}

export function DocViewer({ url, title }: DocViewerProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
        <iframe
          src={url}
          className="w-full h-full"
          title={title}
          allowFullScreen
        />
      </div>
      <div className="mt-2 text-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          Open in new tab
        </a>
      </div>
    </div>
  );
}
