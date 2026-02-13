
import React, { useEffect } from "react"; // Removed useState
import { Card, CardContent } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface WeatherMapProps {
  lat: number;
  lon: number;
  name: string;
  onLocationSelect: (lat: number, lon: number) => void;
}

function FlyToLocation({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], 12, {
      duration: 1.5,
    });
  }, [lat, lon, map]);
  return null;
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      // Just notify parent. The Marker will move when props update.
      onLocationSelect(lat, lng); 
    },
  });
  return null;
}


export const WeatherMap = React.memo(function WeatherMap({
  lat,
  lon,
  name,
  onLocationSelect,
}: WeatherMapProps) {
  return (
    <Card className="overflow-hidden border-none shadow-lg bg-white relative h-full min-h-[400px]">
      <CardContent className="p-0 w-full h-full">
        <MapContainer
          center={[lat, lon]}
          zoom={13}
          scrollWheelZoom={true} 
          zoomSnap={0.5}        
          zoomDelta={0.5}       
          wheelPxPerZoomLevel={120} 
          className="w-full h-full z-10 cursor-crosshair"
        >
          <TileLayer
            keepBuffer={2} // optimization
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {/* DIRECTLY use props here */}
          <Marker position={[lat, lon]}>
            <Popup>
              <div className="text-center">
                <span className="font-bold">{name}</span>
                <br />
                {lat.toFixed(2)}, {lon.toFixed(2)}
              </div>
            </Popup>
          </Marker>

          <FlyToLocation lat={lat} lon={lon} />
          <MapClickHandler onLocationSelect={onLocationSelect} />
          
        </MapContainer>
      </CardContent>
    </Card>
  );
})