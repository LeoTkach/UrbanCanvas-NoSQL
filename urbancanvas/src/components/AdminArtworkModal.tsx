import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function AdminArtworkModal({ 
  artwork, 
  onClose, 
  onSave 
}: { 
  artwork: any, 
  onClose: () => void, 
  onSave: (data: any) => Promise<void> 
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    style: 'Graffiti',
    description: '',
    story: '',
    lng: '30.5234',
    lat: '50.4501'
  });

  useEffect(() => {
    if (artwork) {
      setFormData({
        title: artwork.title || '',
        style: artwork.style || 'Graffiti',
        description: artwork.description || '',
        story: artwork.story || '',
        lng: artwork.location?.coordinates?.[0]?.toString() || '30.5234',
        lat: artwork.location?.coordinates?.[1]?.toString() || '50.4501'
      });
    }
  }, [artwork]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="animatronic-shell relative w-full max-w-md p-1.5 bg-[var(--color-dark-bg)] border border-[#3c3e45] shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div className="rivet" style={{ top: '8px', left: '8px' }}></div>
        <div className="rivet" style={{ top: '8px', right: '8px' }}></div>
        <div className="rivet" style={{ bottom: '8px', left: '8px' }}></div>
        <div className="rivet" style={{ bottom: '8px', right: '8px' }}></div>

        <div className="bg-[#16181b] rounded-lg mt-4 mx-2 mb-2 p-5 border border-[#2c2e33] shadow-inner relative z-10">
          <div className="flex items-center justify-between mb-6 border-b border-[#2c2e33] pb-3">
            <div className="flex items-center gap-2">
              <div className="optic-sensor" style={{ backgroundColor: 'var(--color-eye-red)', boxShadow: '0 0 10px var(--color-eye-red)' }}></div>
              <h2 className="text-xl font-black uppercase tracking-tight text-[#898e94] font-[var(--font-display)]">
                {artwork ? 'Edit Record' : 'New Record'}
              </h2>
            </div>
            <button onClick={onClose} className="text-[#5c6066] hover:text-[var(--color-eye-red)] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6066] mb-1">Title</label>
              <input 
                required 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-[#0a0a0c] border border-[#2c2e33] rounded p-2 text-sm text-[#898e94] focus:outline-none focus:border-[#5c6066] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6066] mb-1">Style</label>
              <select 
                value={formData.style} 
                onChange={e => setFormData({...formData, style: e.target.value})}
                className="w-full bg-[#0a0a0c] border border-[#2c2e33] rounded p-2 text-sm text-[#898e94] focus:outline-none focus:border-[#5c6066] transition-colors"
              >
                <option value="Graffiti">Graffiti</option>
                <option value="Stencil">Stencil</option>
                <option value="Surrealism">Surrealism</option>
                <option value="Realism">Realism</option>
                <option value="Abstract">Abstract</option>
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6066] mb-1">Longitude</label>
                <input 
                  required 
                  type="number" 
                  step="0.0001"
                  value={formData.lng} 
                  onChange={e => setFormData({...formData, lng: e.target.value})}
                  className="w-full bg-[#0a0a0c] border border-[#2c2e33] rounded p-2 text-sm text-[#898e94] focus:outline-none focus:border-[#5c6066] transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6066] mb-1">Latitude</label>
                <input 
                  required 
                  type="number" 
                  step="0.0001"
                  value={formData.lat} 
                  onChange={e => setFormData({...formData, lat: e.target.value})}
                  className="w-full bg-[#0a0a0c] border border-[#2c2e33] rounded p-2 text-sm text-[#898e94] focus:outline-none focus:border-[#5c6066] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6066] mb-1">Description</label>
              <textarea 
                rows={3}
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-[#0a0a0c] border border-[#2c2e33] rounded p-2 text-sm text-[#898e94] focus:outline-none focus:border-[#5c6066] transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6066] mb-1">Story (Log Entry)</label>
              <textarea 
                rows={3}
                value={formData.story} 
                onChange={e => setFormData({...formData, story: e.target.value})}
                className="w-full bg-[#0a0a0c] border border-[#2c2e33] rounded p-2 text-sm text-[#898e94] focus:outline-none focus:border-[#5c6066] transition-colors resize-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 w-full py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[#1a1b1d] border border-[#2c2e33] rounded text-xs font-bold uppercase tracking-[0.2em] text-[#898e94] transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Record'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
