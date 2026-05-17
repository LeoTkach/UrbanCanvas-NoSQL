"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ArtworkCard from "@/components/ArtworkCard";
import { Search, Filter, ChevronLeft, ChevronRight, Map as MapIcon, List, Columns } from "lucide-react";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center font-[var(--font-sans)] text-[var(--color-metal-dim)] text-sm tracking-wider bg-[var(--color-card-surface)] rounded-2xl border border-[rgba(255,255,255,0.03)] shadow-inner">
      Initializing Map...
    </div>
  ),
});

const STYLES = ['All', 'Surrealism', 'Graffiti', 'Stencil', 'Realism', 'Abstract'];

export default function Home() {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [styleFilter, setStyleFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'split' | 'list' | 'map'>('split');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/artworks');
      const data = await res.json();
      setArtworks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const filtered = useMemo(() => {
    let result = artworks;
    if (styleFilter !== 'All') result = result.filter((a) => a.style === styleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.artist?.name?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.tags?.some((t: string) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [artworks, styleFilter, search]);

  const pageSize = view === 'list' ? 9 : 3;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleStyle = (s: string) => { setStyleFilter(s); setPage(1); };

  return (
    <main className="flex-grow flex flex-col w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">

      {/* Header */}
      <header className="w-full relative pb-8 mb-4">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div className="relative inline-block">
            <h1
              className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase tracking-wide leading-none font-[var(--font-display)]"
              style={{
                color: '#1a1c20',
                textShadow: [
                  '-1px -1px 0 rgba(255, 255, 255, 0.25)',
                  '0px -1px 0 rgba(255, 255, 255, 0.15)',
                  '-1px 0px 0 rgba(255, 255, 255, 0.15)',
                  '1px 1px 0 #44484cff',
                  '2px 2px 0 #2a2d32',
                  '3px 3px 0 #1e2125',
                  '4px 4px 0 #14171a',
                  '5px 5px 0 #0d0f12',
                  '6px 6px 0 #09090c',
                  '7px 7px 0 #060608',
                  '8px 8px 0 #050506',
                  '9px 9px 0 #040405',
                  '12px 18px 25px rgba(0,0,0,0.95)'
                ].join(', '),
              }}
            >
              Urban Canvas
            </h1>

            <h1
              className="absolute inset-0 text-6xl sm:text-7xl lg:text-8xl font-black uppercase tracking-wide leading-none font-[var(--font-display)] pointer-events-none"
              aria-hidden="true"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.25'/%3E%3C/svg%3E"), linear-gradient(145deg, #202227ff, #1b1d20)`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Urban Canvas
            </h1>
            <p className="text-sm uppercase tracking-[0.2em] font-bold text-[#898e94] mt-6 max-w-2xl" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
              The underground catalog of Kyiv's street art, graffiti, and murals.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-6">
            <Link href="/admin" className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8a2525] hover:text-[#ff0015] hover:bg-[#3a1a1a] px-2 py-1 rounded transition-colors border border-transparent hover:border-[#8a2525]" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
              [SYS_ADMIN]
            </Link>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.1)] to-transparent hidden md:block"></div>
            <div className="text-right hidden md:block">
              <div className="text-4xl font-black font-[var(--font-display)] text-[#898e94]" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.9)' }}>
                {artworks.length}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5c6066] mt-1" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
                Total Spots
              </div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.1)] to-transparent hidden md:block"></div>
            <div className="text-right hidden md:block">
              <div className="text-4xl font-black font-[var(--font-display)] text-[#898e94]" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.9)' }}>
                {filtered.length}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5c6066] mt-1" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
                Found
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-5 justify-between items-stretch lg:items-center p-5 rounded-2xl bg-[rgba(15,17,21,0.6)] border border-[rgba(255,255,255,0.03)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.02),0_8px_16px_rgba(0,0,0,0.4)] backdrop-blur-md relative z-10">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c6066]" style={{ filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.8))' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search catalog..."
            className="w-full pl-11 pr-4 py-3 sleek-input text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-[#5c6066] mr-2 hidden sm:block" style={{ filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.8))' }} />
          {STYLES.map((s) => (
            <button
              key={s}
              onClick={() => handleStyle(s)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] rounded-lg transition-all duration-200 ${styleFilter === s
                ? 'bg-[#1a1b1d] text-[#898e94] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-[#3c3e45]'
                : 'bg-[rgba(255,255,255,0.02)] text-[#5c6066] hover:text-[#898e94] hover:bg-[#1a1b1d] border border-transparent hover:border-[#2c2e33]'
                }`}
              style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 border-l border-[rgba(255,255,255,0.1)] pl-5 ml-1">
          <button onClick={() => setView('split')} className={`p-2.5 rounded-lg transition-all duration-200 ${view === 'split' ? 'bg-[#1a1b1d] text-[#898e94] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-[#3c3e45]' : 'text-[#5c6066] hover:text-[#898e94] hover:bg-[#1a1b1d] border border-transparent hover:border-[#2c2e33]'}`} aria-label="Split View">
            <Columns className="w-5 h-5" style={{ filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.8))' }} />
          </button>
          <button onClick={() => setView('list')} className={`p-2.5 rounded-lg transition-all duration-200 ${view === 'list' ? 'bg-[#1a1b1d] text-[#898e94] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-[#3c3e45]' : 'text-[#5c6066] hover:text-[#898e94] hover:bg-[#1a1b1d] border border-transparent hover:border-[#2c2e33]'}`} aria-label="List View">
            <List className="w-5 h-5" style={{ filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.8))' }} />
          </button>
          <button onClick={() => setView('map')} className={`p-2.5 rounded-lg transition-all duration-200 ${view === 'map' ? 'bg-[#1a1b1d] text-[#898e94] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-[#3c3e45]' : 'text-[#5c6066] hover:text-[#898e94] hover:bg-[#1a1b1d] border border-transparent hover:border-[#2c2e33]'}`} aria-label="Map View">
            <MapIcon className="w-5 h-5" style={{ filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.8))' }} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`w-full flex-1 ${view === 'split' ? 'grid grid-cols-1 lg:grid-cols-12 gap-8' : 'flex flex-col gap-8'}`}>

        {/* List Section */}
        {view !== 'map' && (
          <div className={`flex flex-col gap-5 ${view === 'split' ? 'lg:col-span-5' : 'w-full'}`}>
            <div className="flex items-center justify-between pb-2 border-b border-[#1a1b1d] shadow-[0_1px_0_rgba(255,255,255,0.02)]">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#898e94]" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>Directory</h2>
            </div>

            {view === 'split' ? (
              <div className="flex flex-col gap-5">
                {loading ? (
                  <Loader />
                ) : paged.length === 0 ? (
                  <Empty search={search} />
                ) : (
                  <>
                    {paged.map((a) => <ArtworkCard key={a._id} artwork={a} isSelected={selectedId === a._id} onSelect={() => setSelectedId(a._id)} />)}
                    <Paginator page={currentPage} total={totalPages} onChange={setPage} />
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {loading ? (
                  <Loader />
                ) : paged.length === 0 ? (
                  <Empty search={search} />
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {paged.map((a) => <ArtworkCard key={a._id} artwork={a} isSelected={selectedId === a._id} onSelect={() => setSelectedId(a._id)} />)}
                    </div>
                    <Paginator page={currentPage} total={totalPages} onChange={setPage} />
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Map Section */}
        {view !== 'list' && (
          <div className={`flex flex-col gap-5 ${view === 'split' ? 'lg:col-span-7' : 'w-full'}`}>
            <div className="flex items-center justify-between pb-2 border-b border-[#1a1b1d] shadow-[0_1px_0_rgba(255,255,255,0.02)]">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#898e94]" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>Coordinates</h2>
            </div>
            <div className="animatronic-shell p-2" style={{ height: view === 'map' ? 'calc(100vh - 350px)' : '700px', minHeight: '500px' }}>
              <div className="w-full h-full rounded-lg overflow-hidden border border-[#1a1b1d]">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center text-[#5c6066] font-bold text-sm tracking-[0.2em] uppercase bg-[#08080a]" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
                    Initializing Map...
                  </div>
                ) : (
                  <Map key={view} artworks={filtered} selectedId={selectedId} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </main>
  );
}

function Loader() {
  return (
    <div className="py-16 text-center">
      <div className="inline-block w-10 h-10 border-[3px] border-[#1a1b1d] border-t-[#898e94] rounded-full animate-spin shadow-[0_0_10px_rgba(0,0,0,0.8)]"></div>
      <div className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6066]" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>Processing...</div>
    </div>
  );
}

function Empty({ search }: { search: string }) {
  return (
    <div className="py-20 px-6 text-center bg-[rgba(255,255,255,0.02)] rounded-2xl border border-[rgba(255,255,255,0.05)] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
      <div className="text-4xl mb-6 text-[#3c3e45]" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.9)' }}>∅</div>
      <h3 className="text-lg font-bold uppercase tracking-[0.2em] text-[#898e94] mb-3" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>No Records</h3>
      <p className="text-[#5c6066] max-w-sm mx-auto text-sm leading-relaxed font-medium" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
        The database returned empty for your query. Adjust filters or search terms.
      </p>
    </div>
  );
}

function Paginator({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-between bg-[rgba(15,17,21,0.6)] rounded-2xl border border-[rgba(255,255,255,0.03)] p-2 mt-2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.02),0_8px_16px_rgba(0,0,0,0.4)] backdrop-blur-md">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold uppercase tracking-[0.1em] text-xs text-[#5c6066] bg-[rgba(255,255,255,0.02)] border border-transparent hover:text-[#898e94] hover:bg-[#1a1b1d] hover:border-[#2c2e33] disabled:opacity-30 disabled:hover:bg-[rgba(255,255,255,0.02)] disabled:hover:border-transparent disabled:hover:text-[#5c6066] transition-all duration-200"
        style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}
      >
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>
      <span className="font-bold tracking-[0.2em] text-xs text-[#898e94]" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
        {page} / {total}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === total}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold uppercase tracking-[0.1em] text-xs text-[#5c6066] bg-[rgba(255,255,255,0.02)] border border-transparent hover:text-[#898e94] hover:bg-[#1a1b1d] hover:border-[#2c2e33] disabled:opacity-30 disabled:hover:bg-[rgba(255,255,255,0.02)] disabled:hover:border-transparent disabled:hover:text-[#5c6066] transition-all duration-200"
        style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
