'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface DocViewerProps {
  url: string;
  title: string;
}

export function DocViewer({ url, title }: DocViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  // Listen for fullscreen changes (e.g. user presses Escape)
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div
        ref={containerRef}
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

        {/* Fullscreen toggle button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded transition-all duration-200 hover:scale-110"
          style={{
            background: 'rgba(10, 10, 10, 0.75)',
            border: '1px solid rgba(227, 100, 20, 0.3)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#e36414',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(227, 100, 20, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(227, 100, 20, 0.6)';
            e.currentTarget.style.color = '#fb8b24';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(10, 10, 10, 0.75)';
            e.currentTarget.style.borderColor = 'rgba(227, 100, 20, 0.3)';
            e.currentTarget.style.color = '#e36414';
          }}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

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
          className="text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-wider transition-colors duration-200"
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
