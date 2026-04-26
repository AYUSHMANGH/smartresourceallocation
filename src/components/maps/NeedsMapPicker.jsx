import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const PICKER_MAP_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "transit", "stylers": [{ "visibility": "off" }] }
];

export default function NeedsMapPicker({ onLocationSelect }) {
  const mapRef = useRef(null);
  const gMapRef = useRef(null);
  const markerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

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
        center: { lat: 20.5937, lng: 78.9629 }, // India Default
        zoom: 4.5,
        styles: PICKER_MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: true,
      });
      gMapRef.current = map;

      markerRef.current = new window.google.maps.Marker({
        position: { lat: 20.5937, lng: 78.9629 },
        map,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
        icon: {
          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
          fillColor: "#C96A42",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#FFFFFF",
          scale: 2,
          anchor: new window.google.maps.Point(12, 24),
        }
      });

      const geocoder = new window.google.maps.Geocoder();

      const updateLocation = (pos) => {
        geocoder.geocode({ location: pos }, (results, status) => {
          let address = `Lat: ${pos.lat().toFixed(4)}, Lng: ${pos.lng().toFixed(4)}`;
          if (status === "OK" && results[0]) {
            address = results[0].formatted_address;
          }
          onLocationSelect(pos.lat(), pos.lng(), address);
        });
      };

      markerRef.current.addListener('dragend', function() {
        updateLocation(markerRef.current.getPosition());
      });

      map.addListener('click', (e) => {
        markerRef.current.setPosition(e.latLng);
        updateLocation(e.latLng);
      });

      setLoaded(true);
    };

    return () => clearInterval(checkGoogle);
  }, []);

  const handleMyLocation = (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    toast.loading("Locating...", { id: 'locating' });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.dismiss('locating');
        const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
        if (gMapRef.current && markerRef.current) {
          gMapRef.current.setCenter(pos);
          gMapRef.current.setZoom(15);
          markerRef.current.setPosition(pos);
          
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: pos }, (results, status) => {
            let address = `Lat: ${pos.lat.toFixed(4)}, Lng: ${pos.lng.toFixed(4)}`;
            if (status === "OK" && results[0]) {
              address = results[0].formatted_address;
            }
            onLocationSelect(pos.lat, pos.lng, address);
          });
        }
      },
      () => {
        toast.error("Unable to retrieve your location", { id: 'locating' });
      }
    );
  };

  return (
    <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-linen-dark shadow-inner bg-linen">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-sage border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 right-4 pointer-events-none">
        <div className="glass px-3 py-2 rounded-xl text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-2">
          <span>📍</span> Click map or drag pin to specify location
        </div>
      </div>
      <button 
        className="absolute bottom-4 right-4 bg-white text-charcoal px-4 py-2 rounded-xl text-xs font-bold shadow-lg border border-linen-dark hover:bg-linen transition-colors active:scale-95 flex items-center gap-2"
        onClick={handleMyLocation}
      >
        <span>🎯</span> Use My Location
      </button>
    </div>
  );
}
