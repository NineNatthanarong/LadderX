'use client';

import { useState, useEffect, useMemo } from 'react';
import { SearchBar } from '@/components/features/SearchBar';
import { SearchResults } from '@/components/features/SearchResults';
import { loadSearchIndex } from '@/lib/data-loader';
import { search } from '@/lib/search';
import { SearchIndexItem } from '@/lib/types';
import { Database, Layers, FileText, Zap } from 'lucide-react';
import Image from 'next/image';

const COLORS = ['#6b0504', '#9a031e', '#e36414', '#fb8b24'];

function useParticles(count: number) {
  const [particles, setParticles] = useState<Array<{
    left: string; width: string; height: string;
    background: string; opacity: number;
    animation: string; animationDelay: string;
  }>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, () => ({
        left: `${Math.random() * 100}%`,
        width: `${2 + Math.random() * 4}px`,
        height: `${2 + Math.random() * 4}px`,
        background: `linear-gradient(135deg, ${COLORS[Math.floor(Math.random() * 4)]}, transparent)`,
        opacity: 0.3 + Math.random() * 0.4,
        animation: `particleFloat ${12 + Math.random() * 20}s linear infinite`,
        animationDelay: `${-Math.random() * 20}s`,
      }))
    );
  }, [count]);

  return particles;
}

function ParticleBackground() {
  const particles = useParticles(20);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
      {/* Ambient glow orbs */}
      <div
        className="absolute animate-pulse-glow"
        style={{
          top: '10%',
          right: '15%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(154, 3, 30, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute animate-pulse-glow delay-500"
        style={{
          bottom: '20%',
          left: '10%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(227, 100, 20, 0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute animate-pulse-glow delay-300"
        style={{
          top: '50%',
          left: '50%',
          width: '400px',
          height: '400px',
          marginLeft: '-200px',
          marginTop: '-200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(107, 5, 4, 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Floating particles — client-only to avoid hydration mismatch */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={p}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [index, setIndex] = useState<SearchIndexItem[]>([]);
  const [results, setResults] = useState<SearchIndexItem[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function init() {
      const data = await loadSearchIndex();
      setIndex(data);
      setLoading(false);
    }
    init();
  }, []);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);

    if (newQuery.length < 3) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const hits = search(newQuery, index);
    setResults(hits);
    setIsSearching(false);
  };

  const stats = useMemo(() => {
    if (index.length === 0) return null;
    const uniqueDocs = new Set(index.map((item) => item.documentId));
    const uniqueCategories = new Set(index.map((item) => item.category));
    return {
      documents: uniqueDocs.size,
      categories: uniqueCategories.size,
      pages: index.length,
    };
  }, [index]);

  return (
    <main className="min-h-screen bg-background py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative">
      <ParticleBackground />

      <div className="max-w-4xl mx-auto relative">
        {/* Hero */}
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          {/* Badge */}
          <div className="inline-block mb-4 sm:mb-6 animate-fade-in-up">
            <span
              className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.3em] px-3 sm:px-4 py-1 sm:py-1.5 text-foreground"
              style={{
                background: 'linear-gradient(135deg, rgba(107, 5, 4, 0.3), rgba(154, 3, 30, 0.2))',
                border: '1px solid rgba(227, 100, 20, 0.3)',
              }}
            >
              <Zap className="inline h-3 w-3 mr-1.5 -mt-0.5 text-accent" />
              MELSEC REFERENCE
            </span>
          </div>

          {/* Title with gradient */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight uppercase leading-none mb-3 sm:mb-4 md:mb-6 animate-fade-in-up delay-100">
            <span className="text-foreground">Syntax</span>
            <br />
            <span className="text-gradient">Documentation</span>
          </h1>

          {/* Decorative accent line */}
          <div className="flex justify-center mb-4 sm:mb-6 animate-fade-in-up delay-200">
            <div
              className="h-[2px] w-16 sm:w-24"
              style={{ background: 'var(--gradient-brand-h)' }}
            />
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto tracking-wide animate-fade-in-up delay-200">
            {loading ? (
              <span className="inline-block w-48 h-5 rounded animate-shimmer" />
            ) : (
              <>
                <span className="text-accent font-bold">{index.length}</span> documentation pages indexed and searchable.
              </>
            )}
          </p>
        </div>

        {/* Search */}
        <div className="animate-slide-up delay-300">
          <SearchBar onSearch={handleSearch} isSearching={isSearching || loading} />
        </div>

        {/* Results */}
        <SearchResults
          results={results}
          query={query}
          isSearching={isSearching}
        />

        {/* Live Stats */}
        {!query && !loading && stats && (
          <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {[
              { icon: FileText, label: 'Documents', value: stats.documents, color: '#6b0504' },
              { icon: Layers, label: 'Categories', value: stats.categories, color: '#9a031e' },
              { icon: Database, label: 'Pages Indexed', value: stats.pages, color: '#e36414' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`glass group relative overflow-hidden py-5 sm:py-6 md:py-8 px-4 sm:px-5 text-center hover:scale-[1.02] transition-all duration-300 animate-scale-in delay-${(i + 5) * 100}`}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${stat.color}15 0%, transparent 70%)`,
                    }}
                  />

                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'var(--gradient-brand-h)' }}
                  />

                  <div className="relative">
                    <Icon
                      className="h-5 w-5 text-accent mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
                      style={{ filter: `drop-shadow(0 0 6px ${stat.color}60)` }}
                    />
                    <span className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-foreground tabular-nums animate-count-up delay-${(i + 6) * 100}`}>
                      {stat.value}
                    </span>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted mt-2">
                      {stat.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 sm:mt-12 md:mt-16 text-center animate-fade-in delay-700">
          <div
            className="glass rounded px-3 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 w-full sm:max-w-xl sm:inline-block relative overflow-hidden"
          >
            {/* Top gradient border */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: 'var(--gradient-brand-h)' }}
            />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-2">
              PLC Competition 2026
            </p>
            <p className="text-[11px] sm:text-xs text-muted leading-relaxed">
              This website is made for <span className="text-foreground font-semibold">PLC Competition 2026</span> purpose only.
              Built by <span className="text-foreground font-semibold">BananaCat Team</span>.
              All information is sourced from official documentation by <span className="text-foreground font-semibold">Mitsubishi Electric</span>.
            </p>
          </div>
        </div>

        {/* Footer accent line */}
        <div className="mt-8 sm:mt-10 flex items-center gap-3 sm:gap-4 animate-fade-in delay-800">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #9a031e, #e36414)' }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gradient">LadderX</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #e36414, #9a031e, transparent)' }} />
        </div>
      </div>
    </main>
  );
}
