"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function MapPanner({ selectedId, artworks }: { selectedId: string | null, artworks: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (selectedId) {
      const art = artworks.find(a => a._id === selectedId);
      if (art) {
        map.flyTo([art.location.coordinates[1], art.location.coordinates[0]], 15, {
          duration: 1.5
        });
      }
    }
  }, [selectedId, artworks, map]);
  return null;
}

export default function Map({ artworks, selectedId }: { artworks: any[], selectedId?: string | null }) {
  const customIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [22, 36],
    iconAnchor: [11, 36],
    popupAnchor: [1, -30],
    shadowSize: [36, 36],
  });

  return (
    <div className="w-full h-full min-h-[500px] relative">
      <MapContainer
        center={[50.4501, 30.5234]}
        zoom={12}
        style={{ height: "100%", width: "100%", minHeight: "500px", background: "#040405" }}
        zoomControl={true}
      >
        <MapPanner selectedId={selectedId || null} artworks={artworks} />
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        {artworks.map((artwork) => (
          <Marker
            key={artwork._id}
            position={[artwork.location.coordinates[1], artwork.location.coordinates[0]]}
            icon={customIcon}
          >
            <Popup>
              <div style={{
                fontFamily: "var(--font-sans)",
                background: "linear-gradient(145deg, #0f1115, #08090b)",
                color: "var(--color-metal-text)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                padding: "16px",
                minWidth: "220px",
                boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.05), inset 0 -2px 10px rgba(0, 0, 0, 0.8), 0 15px 30px rgba(0, 0, 0, 0.8)",
              }}>
                <strong style={{ fontFamily: "var(--font-display)", fontSize: "18px", textTransform: "uppercase", display: "block", marginBottom: "4px", color: "var(--color-metal-text)", textShadow: "0 0 10px rgba(255, 255, 255, 0.1)" }}>
                  {artwork.title}
                </strong>
                <span style={{ color: "var(--color-metal-dim)", fontSize: "12px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {artwork.artist?.name ?? "Unknown Artist"}
                </span>
                {artwork.description && (
                  <p style={{ color: "var(--color-metal-text)", fontSize: "12px", marginTop: "12px", lineHeight: 1.5, opacity: 0.8, fontWeight: 300 }}>
                    "{artwork.description}"
                  </p>
                )}
                <div style={{ background: "rgba(0,0,0,0.3)", padding: "6px 10px", color: "var(--color-metal-text)", fontSize: "11px", marginTop: "16px", fontWeight: "500", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.02)", opacity: 0.7 }}>
                  COORD: {artwork.location.coordinates[1].toFixed(4)}, {artwork.location.coordinates[0].toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          border-radius: 0 !important;
        }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip-container { display: none; }
        .leaflet-container { background: var(--color-dark-bg) !important; border-radius: 16px; }
        .leaflet-control-zoom a {
          background: linear-gradient(180deg, #1f2229, #121418) !important;
          color: var(--color-metal-text) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 6px !important;
          font-family: var(--font-display) !important;
          box-shadow: 0 4px 6px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05) !important;
          margin-bottom: 4px !important;
        }
        .leaflet-control-zoom a:hover {
          background: #2a2e38 !important;
          color: #fff !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .leaflet-control-attribution {
          background: rgba(10, 11, 16, 0.8) !important;
          color: var(--color-metal-dim) !important;
          font-family: var(--font-sans) !important;
          font-size: 10px !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 6px !important;
          backdrop-filter: blur(4px);
        }
        .leaflet-control-attribution a { color: var(--color-metal-text) !important; }
      `}} />
    </div>
  );
}
