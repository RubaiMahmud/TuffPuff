'use client';

import { useCallback, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Loader2, Info } from 'lucide-react';

// Fix for default Leaflet marker icons not loading correctly in Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

interface MapPickerInnerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  defaultCenter?: { lat: number; lng: number };
}

const defaultPosition = { lat: 23.8103, lng: 90.4125 }; // Dhaka center point

// Sub-component to handle map clicks and sync center
function MapEvents({ onMapClick, centerPos }: { onMapClick: (e: L.LeafletMouseEvent) => void; centerPos: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([centerPos.lat, centerPos.lng], map.getZoom());
  }, [centerPos, map]);

  useMapEvents({
    click(e) {
      onMapClick(e);
    },
  });
  return null;
}

export default function MapPickerInner({ onLocationSelect, defaultCenter }: MapPickerInnerProps) {
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(defaultCenter || null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [address, setAddress] = useState('');

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await response.json();

      if (data && data.display_name) {
        const addr = data.display_name;
        setAddress(addr);
        onLocationSelect({ lat, lng, address: addr });
      } else {
        throw new Error('No display name found');
      }
    } catch (err) {
      console.error('Nominatim geocoding failed:', err);
      const addr = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(addr);
      onLocationSelect({ lat, lng, address: addr });
    }
  }, [onLocationSelect]);

  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    setMarker({ lat, lng });
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  const detectLocation = useCallback(() => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setMarker({ lat, lng });
        reverseGeocode(lat, lng);
        setLoadingLocation(false);
      },
      () => {
        setLoadingLocation(false);
        alert('Unable to detect location. Please enable location services.');
      }
    );
  }, [reverseGeocode]);

  return (
    <div className="space-y-3 relative z-10">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={detectLocation}
          disabled={loadingLocation}
          className="flex items-center gap-2 px-4 py-2 bg-lime-500/10 text-lime-400 border border-lime-400/20 rounded-lg text-sm font-bold hover:bg-lime-500/20 hover:border-lime-400/50 transition-colors disabled:opacity-50"
        >
          {loadingLocation ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
          Use my location
        </button>
      </div>

      <div className="h-[300px] w-full rounded-xl overflow-hidden border border-zinc-800 shadow-[0_0_15px_rgba(163,230,53,0.1)] relative z-0">
        <MapContainer
          center={marker ? [marker.lat, marker.lng] : [defaultPosition.lat, defaultPosition.lng]}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <MapEvents onMapClick={handleMapClick} centerPos={marker || defaultPosition} />

          {marker && <Marker position={[marker.lat, marker.lng]} />}

          <Circle
            center={[defaultPosition.lat, defaultPosition.lng]}
            radius={5000}
            pathOptions={{
              color: '#A3E635',
              fillColor: '#A3E635',
              fillOpacity: 0.1,
              weight: 2,
            }}
          />
        </MapContainer>
      </div>

      <div className="flex items-start gap-2 text-zinc-400 text-xs px-1">
        <Info size={14} className="shrink-0 mt-0.5 text-lime-400" />
        <p>
          The <strong className="text-lime-400">green circle</strong> represents our instant 30-minute delivery zone. Locations outside this radius may experience slightly longer delivery times.
        </p>
      </div>

      <div className="flex items-start gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-xl shadow-inner mt-2 min-h-[48px]">
        <MapPin size={16} className="text-lime-400 mt-0.5 shrink-0" />
        {address ? (
          <p className="text-zinc-300 text-sm font-medium">{address}</p>
        ) : (
          <p className="text-zinc-500 text-sm italic">Click on the map or detect location to set address.</p>
        )}
      </div>
    </div>
  );
}
