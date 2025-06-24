'use client';

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useEffect } from 'react';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

interface MapaFormularioProps {
  location: [number, number] | null;
  setLocation: (loc: [number, number]) => void;
}

function LocationMarker({ setLocation }: { setLocation: (loc: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setLocation([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// Componente para centrar el mapa cuando cambia la ubicación
function CenterMapOnLocation({ location }: { location: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView(location, 16);
    }
  }, [location, map]);
  return null;
}

export default function MapaFormulario({ location, setLocation }: MapaFormularioProps) {
  useEffect(() => {
    // Forzar z-index bajo a los elementos de Leaflet
    const panes = document.querySelectorAll('.leaflet-pane, .leaflet-control');
    panes.forEach(el => {
      (el as HTMLElement).style.zIndex = '1';
    });
  }, []);

  return (
    <div className="h-[300px] border rounded mt-20" style={{zIndex: 1, position: 'relative'}}>
      <MapContainer
        center={(location ? location : [-25.2822, -57.6351]) as LatLngExpression}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {location && <Marker position={location} />}
        <LocationMarker setLocation={setLocation} />
        <CenterMapOnLocation location={location} />
      </MapContainer>
    </div>
  );
} 