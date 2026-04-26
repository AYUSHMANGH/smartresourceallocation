import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle } from 'react-leaflet';

export default function WorldMap() {
  const position = [22.5937, 78.9629];

  const hotspots = [
    { lat: 28.6139, lng: 77.2090, weight: 10, label: 'North India' },
    { lat: 19.0760, lng: 72.8777, weight: 8, label: 'West India' },
    { lat: 13.0827, lng: 80.2707, weight: 6, label: 'South India' },
    { lat: 22.5726, lng: 88.3639, weight: 12, label: 'East India' },
    { lat: 21.1458, lng: 79.0882, weight: 5, label: 'Central India' },
  ];

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-[#1a1c1a]">
      <MapContainer center={position} zoom={4.5} style={{ height: '100%', width: '100%', backgroundColor: '#1a1c1a' }} zoomControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {hotspots.map((spot, idx) => (
          <React.Fragment key={idx}>
            <Circle
              center={[spot.lat, spot.lng]}
              radius={Math.sqrt(spot.weight) * 50000} // Reduced radius for better visibility
              pathOptions={{
                color: spot.weight > 9 ? "#D94F3D" : "#6B7F5E",
                fillColor: spot.weight > 9 ? "#D94F3D" : "#6B7F5E",
                fillOpacity: 0.35,
                weight: 2
              }}
            />
            <CircleMarker
              center={[spot.lat, spot.lng]}
              radius={4}
              pathOptions={{
                color: '#FFFFFF',
                fillColor: spot.weight > 9 ? "#D94F3D" : "#6B7F5E",
                fillOpacity: 1,
                weight: 1
              }}
            >
              <Popup>{spot.label}</Popup>
            </CircleMarker>
          </React.Fragment>
        ))}
      </MapContainer>
      
      {/* Map HUD Overlay */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-[10]">
        <div className="glass-dark px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-critical animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Live Response Tracking</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2 z-[10]">
        <div className="glass-dark px-3 py-2 rounded-xl flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-critical" />
            <span className="text-[10px] font-bold text-white opacity-80 uppercase tracking-tighter">Critical Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sage" />
            <span className="text-[10px] font-bold text-white opacity-80 uppercase tracking-tighter">Stable Region</span>
          </div>
        </div>
      </div>
    </div>
  );
}
