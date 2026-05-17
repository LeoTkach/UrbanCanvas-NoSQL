import { useState } from "react";
import { MapPin, Calendar, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

export default function ArtworkCard({ artwork, isSelected, onSelect }: { artwork: any, isSelected?: boolean, onSelect?: () => void }) {
  const [expanded, setExpanded] = useState(false);

  const statusKey = (artwork.status ?? '').toLowerCase();
  
  let statusBadge = null;
  if (statusKey === 'removed') {
    statusBadge = <span className="text-[9px] font-bold text-[#8a2525] uppercase tracking-[0.2em] bg-[#1a1111] px-2 py-0.5 rounded border border-[#3a1a1a]" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>REMOVED</span>;
  } else if (statusKey === 'faded') {
    statusBadge = <span className="text-[9px] font-bold text-[#5c6066] uppercase tracking-[0.2em] bg-[#151618] px-2 py-0.5 rounded border border-[#2a2c30]" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>FADED</span>;
  } else if (statusKey === 'active') {
    statusBadge = <span className="text-[9px] font-bold text-[#898e94] uppercase tracking-[0.2em] bg-[#1a1c20] px-2 py-0.5 rounded border border-[#3c3e45]" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>ACTIVE</span>;
  }

  const isUnknown = !artwork.artist;
  const hasStory = !!artwork.story;

  return (
    <div className="flex flex-col relative group cursor-pointer" onClick={onSelect}>
      {/* Main Shell */}
      <div className={`animatronic-shell flex flex-col p-1.5 z-10 bg-[var(--color-dark-bg)] transition-colors duration-300 ${isSelected ? 'border-[var(--color-eye-red)] shadow-[0_0_15px_rgba(255,0,21,0.2)]' : ''}`}>
        {/* 4 Rivets in the corners of the main shell */}
        <div className="rivet" style={{ top: '8px', left: '8px' }}></div>
        <div className="rivet" style={{ top: '8px', right: '8px' }}></div>
        <div className="rivet" style={{ bottom: '8px', left: '8px' }}></div>
        <div className="rivet" style={{ bottom: '8px', right: '8px' }}></div>

        {/* Inner panel area */}
        <div className="flex-grow flex flex-col bg-[#16181b] rounded-lg mt-5 mx-2 mb-2 p-4 border border-[#2c2e33] shadow-inner relative z-10">
          
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="optic-sensor"></div>
                <h3 className="text-xl font-black uppercase tracking-tight text-[#898e94] font-[var(--font-display)] leading-tight" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
                  {artwork.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                {isUnknown ? (
                  <div className="text-[#898e94] font-bold text-[10px] uppercase tracking-[0.2em]" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
                    // Unknown Artist
                  </div>
                ) : (
                  <div className="text-[#898e94] font-bold text-[10px] uppercase tracking-[0.2em]" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
                    // {artwork.artist.name}
                  </div>
                )}
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-2">
              {statusBadge}
              {artwork.year && (
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#5c6066] flex items-center gap-1" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
                  <Calendar className="w-3 h-3" /> {artwork.year}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-[#898e94] leading-relaxed mb-6 flex-grow font-medium" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
            "{artwork.description || 'No description provided.'}"
          </p>

          {/* Map location & Tags */}
          <div className="flex flex-col gap-3 mb-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#5c6066]" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#3c3e45]" />
              <span>COORD: {artwork.location.coordinates[1].toFixed(4)}, {artwork.location.coordinates[0].toFixed(4)}</span>
            </div>

            <div className="flex justify-between items-end">
              {artwork.tags?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {artwork.tags.map((tag: string) => (
                    <span key={tag} className="text-[9px] font-bold uppercase tracking-[0.1em] bg-[#0f1012] border border-[#2a2c30] text-[#5c6066] rounded-sm px-2 py-0.5" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : <div></div>}

              {hasStory && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#898e94] hover:text-white transition-colors ml-auto"
                  style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}
                >
                  <BookOpen className="w-3 h-3" />
                  {expanded ? 'Hide Log' : 'Access Log'}
                  {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Mechanical Tray */}
      <div 
        className="mx-3 bg-[#08080a] endo-mesh border-x border-b border-[#1a1c20] rounded-b-xl transition-all duration-700 ease-in-out z-0"
        style={{
          maxHeight: expanded ? '500px' : '0px',
          transform: expanded ? 'translateY(0)' : 'translateY(-20px)',
          marginTop: expanded ? '0' : '-10px',
          boxShadow: expanded ? '0 15px 25px rgba(0,0,0,0.8)' : 'none',
          overflow: expanded ? 'visible' : 'hidden',
          opacity: 1
        }}
      >
        <div className="p-5 relative">
          {/* Wires inside the mesh */}
          <div className="absolute left-3 top-0 bottom-0 w-1 bg-[var(--color-wire-red)] opacity-60 shadow-[2px_0_4px_rgba(0,0,0,0.8)]"></div>
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#444] opacity-50 shadow-[1px_0_2px_rgba(0,0,0,0.8)]"></div>
          
          <div className="relative z-10 pl-5 text-[13px] text-[#b0b3b8] italic leading-relaxed font-medium">
            {artwork.story}
          </div>
        </div>
      </div>
    </div>
  );
}
