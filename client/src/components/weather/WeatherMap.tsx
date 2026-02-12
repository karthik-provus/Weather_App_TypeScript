
// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card"; // removed CardHeader import
// import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// // MapPin is no longer needed since we removed the header
// // import { MapPin } from "lucide-react"; 

// import icon from "leaflet/dist/images/marker-icon.png";
// import iconShadow from "leaflet/dist/images/marker-shadow.png";

// const DefaultIcon = L.icon({
//   iconUrl: icon,
//   shadowUrl: iconShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// L.Marker.prototype.options.icon = DefaultIcon;

// interface WeatherMapProps {
//   lat: number;
//   lon: number;
//   name: string;
//   onLocationSelect: (lat: number, lon: number) => void;
// }

// function FlyToLocation({ lat, lon }: { lat: number; lon: number }) {
//   const map = useMap();
//   useEffect(() => {
//     map.flyTo([lat, lon], 12, {
//       duration: 1.5,
//     });
//   }, [lat, lon, map]);
//   return null;
// }

// function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lon: number) => void }) {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       onLocationSelect(lat, lng);
//     },
//   });
//   return null;
// }

// export function WeatherMap({ lat, lon, name, onLocationSelect }: WeatherMapProps) {
//   const [position, setPosition] = useState<[number, number]>([lat, lon]);

//   useEffect(() => {
//     setPosition([lat, lon]);
//   }, [lat, lon]);

//   return (
//     <Card className="overflow-hidden border-none shadow-lg bg-white relative h-full min-h-[400px]">
//       {/* --- Header Removed --- */}
      
//       <CardContent className="p-0 w-full h-full">
//         <MapContainer
//           center={[lat, lon]}
//           zoom={13}
//           scrollWheelZoom={true} 
//           zoomSnap={0.5}        
//           zoomDelta={0.5}       
//           wheelPxPerZoomLevel={120} 
//           className="w-full h-full z-10 cursor-crosshair"
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//             url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
//           />
          
//           <Marker position={position}>
//             <Popup>
//               <div className="text-center">
//                 <span className="font-bold">{name}</span>
//                 <br />
//                 {position[0].toFixed(2)}, {position[1].toFixed(2)}
//               </div>
//             </Popup>
//           </Marker>

//           <FlyToLocation lat={lat} lon={lon} />
//           <MapClickHandler onLocationSelect={onLocationSelect} />
          
//         </MapContainer>
//       </CardContent>
//     </Card>
//   );
// }


import { useEffect } from "react"; // Removed useState
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

export function WeatherMap({ lat, lon, name, onLocationSelect }: WeatherMapProps) {
  // --- DELETED: Local state and useEffect are no longer needed ---

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
}