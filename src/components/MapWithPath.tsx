import { useEffect } from "react";
import { Marker, Polyline, useMapEvents, useMap } from "react-leaflet";
import { LatLng } from "leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Creating a custom icon
const customIcon = new L.Icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [15, 26], // size of the icon
  iconAnchor: [8, 26], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  shadowSize: [26, 26], // size of the shadow
});

interface MapWithPathProps {
  onAddMarker: (latlng: LatLng) => void;
  markers: LatLng[];
  polyline: LatLng[];
  center: LatLng;
}

const MapWithPath = ({
  onAddMarker,
  markers,
  polyline,
  center,
}: MapWithPathProps) => {
  useMapEvents({
    click(e) {
      onAddMarker(e.latlng);
    },
  });

  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13);
  }, [center, map]);

  return (
    <>
      {markers.map((position, idx) => (
        <Marker key={idx} position={position} icon={customIcon} />
      ))}
      <Polyline positions={polyline} color="teal" />
    </>
  );
};

export default MapWithPath;
