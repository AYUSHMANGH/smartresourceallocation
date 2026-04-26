import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import toast from 'react-hot-toast';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, onLocationSelect }) {
  const markerRef = useRef(null);

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      const address = data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
      onLocationSelect(lat, lng, address);
    } catch (e) {
      onLocationSelect(lat, lng, `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
    }
  };

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetchAddress(e.latlng.lat, e.latlng.lng);
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latlng = marker.getLatLng();
          setPosition(latlng);
          fetchAddress(latlng.lat, latlng.lng);
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return position === null ? null : (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
}

function CenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom() < 15 ? 15 : map.getZoom());
    }
  }, [position, map]);
  return null;
}

export default function NeedsMapPicker({ onLocationSelect }) {
  const [position, setPosition] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapCenter, setMapCenter] = useState(null);

  const handleMyLocation = (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    toast.loading("Locating...", { id: 'locating' });
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        toast.dismiss('locating');
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(newPos);
        setMapCenter(newPos); // triggers Map view update
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos.lat}&lon=${newPos.lng}`);
          const data = await res.json();
          const address = data.display_name || `Lat: ${newPos.lat.toFixed(4)}, Lng: ${newPos.lng.toFixed(4)}`;
          onLocationSelect(newPos.lat, newPos.lng, address);
        } catch (e) {
          onLocationSelect(newPos.lat, newPos.lng, `Lat: ${newPos.lat.toFixed(4)}, Lng: ${newPos.lng.toFixed(4)}`);
        }
      },
      () => {
        toast.error("Unable to retrieve your location", { id: 'locating' });
      }
    );
  };

  return (
    <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-linen-dark shadow-inner bg-linen">
      <MapContainer center={{ lat: 20.5937, lng: 78.9629 }} zoom={4.5} style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
        {mapCenter && <CenterMap position={mapCenter} />}
      </MapContainer>
      
      <div className="absolute top-4 left-4 right-4 pointer-events-none z-[400]">
        <div className="glass px-3 py-2 rounded-xl text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-2 w-fit">
          <span>📍</span> Click map or drag pin to specify location
        </div>
      </div>
      <button 
        className="absolute bottom-4 right-4 bg-white text-charcoal px-4 py-2 rounded-xl text-xs font-bold shadow-lg border border-linen-dark hover:bg-linen transition-colors active:scale-95 flex items-center gap-2 z-[400]"
        onClick={handleMyLocation}
      >
        <span>🎯</span> Use My Location
      </button>
    </div>
  );
}
