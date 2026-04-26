import React, { useEffect, useRef, useState } from 'react';

const DARK_MAP_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#1a1c1a" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
  { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
  { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
  { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
];

export default function WorldMap() {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const checkGoogle = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(checkGoogle);
        initMap();
      }
    }, 100);

    const initMap = () => {
      if (!mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 22.5937, lng: 78.9629 },
        zoom: 4.5,
        styles: DARK_MAP_STYLE,
        disableDefaultUI: true,
        backgroundColor: '#1a1c1a',
      });

      // Simulation of heatmap/distribution data
      const hotspots = [
        { lat: 28.6139, lng: 77.2090, weight: 10, label: 'North India' },
        { lat: 19.0760, lng: 72.8777, weight: 8, label: 'West India' },
        { lat: 13.0827, lng: 80.2707, weight: 6, label: 'South India' },
        { lat: 22.5726, lng: 88.3639, weight: 12, label: 'East India' },
        { lat: 21.1458, lng: 79.0882, weight: 5, label: 'Central India' },
      ];

      hotspots.forEach(spot => {
        // Add glowing pulse effect via Custom Overlay or simple circle
        const cityCircle = new window.google.maps.Circle({
          strokeColor: spot.weight > 9 ? "#D94F3D" : "#6B7F5E",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: spot.weight > 9 ? "#D94F3D" : "#6B7F5E",
          fillOpacity: 0.35,
          map: map,
          center: { lat: spot.lat, lng: spot.lng },
          radius: Math.sqrt(spot.weight) * 200000,
        });

        // Add small core marker
        new window.google.maps.Marker({
          position: { lat: spot.lat, lng: spot.lng },
          map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: spot.weight > 9 ? "#D94F3D" : "#6B7F5E",
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#FFFFFF',
            scale: 4,
          },
        });
      });

      setMapLoaded(true);
    };

    return () => clearInterval(checkGoogle);
  }, []);

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-[#1a1c1a]">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-charcoal text-white z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold tracking-widest uppercase opacity-50">Initializing Geographic Layer...</span>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map HUD Overlay */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
        <div className="glass-dark px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-critical animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Live Response Tracking</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2">
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
