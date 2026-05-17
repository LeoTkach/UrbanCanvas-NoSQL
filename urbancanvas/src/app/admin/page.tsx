"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminArtworkModal from "@/components/AdminArtworkModal";
import { Plus, Edit2, Trash2, ArrowLeft, Terminal } from "lucide-react";

export default function AdminPage() {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<any>(null);
  const [purgeId, setPurgeId] = useState<string | null>(null);

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

  const handleSave = async (data: any) => {
    try {
      if (editingArtwork) {
        await fetch(`/api/artworks/${editingArtwork._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } else {
        await fetch('/api/artworks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }
      setModalOpen(false);
      fetchArtworks();
    } catch (e) {
      console.error(e);
    }
  };

  const executePurge = async () => {
    if (!purgeId) return;
    try {
      await fetch(`/api/artworks/${purgeId}`, { method: 'DELETE' });
      setPurgeId(null);
      fetchArtworks();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex-grow flex flex-col w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
      
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-[#3c3e45] pb-6 mb-2">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6066] hover:text-[#898e94] transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4">
            <Terminal className="w-12 h-12 text-[#8a2525]" style={{ filter: 'drop-shadow(0 0 10px rgba(255,0,21,0.5))' }} />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-wide text-[#898e94] font-[var(--font-display)]" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.9)' }}>
                Control Room
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5c6066] mt-1" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
                SYS_ADMIN // Database Management Terminal
              </p>
            </div>
          </div>
          <button 
            onClick={() => { setEditingArtwork(null); setModalOpen(true); }} 
            className="flex items-center gap-2 px-5 py-3 bg-[#8a2525] text-white text-[10px] font-bold uppercase tracking-[0.1em] rounded border border-[#3a1a1a] shadow-[0_0_10px_rgba(255,0,21,0.2)] hover:shadow-[0_0_20px_rgba(255,0,21,0.4)] transition-all"
          >
            <Plus className="w-4 h-4" /> Initialize New Record
          </button>
        </div>
      </header>

      {/* Data Table */}
      <div className="animatronic-shell p-1.5 bg-[var(--color-dark-bg)]">
        <div className="bg-[#16181b] rounded mt-4 mx-2 mb-2 border border-[#2c2e33] shadow-inner overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#2c2e33] bg-[#1a1c20]">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6066]">Record ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6066]">Title</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6066]">Artist</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6066]">Style</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6066]">Coordinates</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6066] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2c2e33]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6066]">
                    Loading Records...
                  </td>
                </tr>
              ) : artworks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6066]">
                    No Records Found in Database
                  </td>
                </tr>
              ) : (
                artworks.map((a) => (
                  <tr key={a._id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="px-6 py-4 text-[10px] text-[#5c6066] font-mono">{a._id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#898e94]">{a.title}</td>
                    <td className="px-6 py-4 text-xs text-[#898e94]">{a.artist?.name || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] font-bold uppercase tracking-[0.1em] bg-[#0f1012] border border-[#2a2c30] text-[#5c6066] rounded-sm px-2 py-0.5">
                        {a.style}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] text-[#5c6066] font-mono">
                      {a.location?.coordinates?.[1]?.toFixed(4) ?? 'N/A'}, {a.location?.coordinates?.[0]?.toFixed(4) ?? 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => { setEditingArtwork(a); setModalOpen(true); }}
                          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#5c6066] hover:text-[#898e94] transition-colors"
                        >
                          <Edit2 className="w-3 h-3" /> Modify
                        </button>
                        <button 
                          onClick={() => setPurgeId(a._id)}
                          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#5c6066] hover:text-[var(--color-eye-red)] transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Purge
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <AdminArtworkModal
          artwork={editingArtwork}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {purgeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="animatronic-shell relative w-full max-w-sm p-1.5 bg-[var(--color-dark-bg)] border border-[#3c3e45] shadow-[0_0_30px_rgba(255,0,21,0.5)]">
            <div className="rivet" style={{ top: '8px', left: '8px' }}></div>
            <div className="rivet" style={{ top: '8px', right: '8px' }}></div>
            <div className="rivet" style={{ bottom: '8px', left: '8px' }}></div>
            <div className="rivet" style={{ bottom: '8px', right: '8px' }}></div>

            <div className="bg-[#16181b] rounded-lg mt-4 mx-2 mb-2 p-5 border border-[var(--color-eye-red)] shadow-[inset_0_0_15px_rgba(255,0,21,0.2)] relative z-10 text-center">
              <h2 className="text-xl font-black uppercase tracking-widest text-[#898e94] font-[var(--font-display)] mb-2" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
                System Warning
              </h2>
              <p className="text-xs text-[var(--color-eye-red)] font-bold uppercase tracking-[0.2em] mb-6">
                Are you sure you want to permanently purge this record?
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setPurgeId(null)}
                  className="flex-1 py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[#1a1b1d] border border-[#2c2e33] rounded text-xs font-bold uppercase tracking-[0.2em] text-[#898e94] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={executePurge}
                  className="flex-1 py-3 bg-[#8a2525] hover:bg-[var(--color-eye-red)] border border-[#3a1a1a] rounded text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors shadow-[0_0_10px_rgba(255,0,21,0.3)]"
                >
                  Confirm Purge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
