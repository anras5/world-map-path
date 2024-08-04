import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLng } from "leaflet";
import * as turf from "@turf/turf";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Creating a custom icon
const customIcon = new L.Icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41], // size of the shadow
});

interface MapWithPathProps {
  onAddMarker: (latlng: LatLng) => void;
  markers: LatLng[];
  polyline: LatLng[];
}

function MapWithPath({ onAddMarker, markers, polyline }: MapWithPathProps) {
  useMapEvents({
    click(e) {
      onAddMarker(e.latlng);
    },
  });

  return (
    <>
      {markers.map((position, idx) => (
        <Marker key={idx} position={position} icon={customIcon} />
      ))}
      <Polyline positions={polyline} color="teal" />
    </>
  );
}

function App() {
  const [markers, setMarkers] = useState<LatLng[]>([]);
  const [totalDistance, setTotalDistance] = useState<number>(0);

  const addMarker = (latlng: LatLng) => {
    const newMarkers = [...markers, latlng];
    setMarkers(newMarkers);
    calculateDistance(newMarkers);
  };

  const calculateDistance = (markers: LatLng[]) => {
    let distance = 0;
    for (let i = 0; i < markers.length - 1; i++) {
      const from = turf.point([markers[i].lng, markers[i].lat]);
      const to = turf.point([markers[i + 1].lng, markers[i + 1].lat]);
      distance += turf.distance(from, to, { units: "meters" });
    }

    setTotalDistance(distance);
  };

  const resetMarkers = () => {
    setMarkers([]);
    setTotalDistance(0);
  };

  const removeLastMarker = () => {
    const newMarkers = [...markers];
    newMarkers.pop();
    setMarkers(newMarkers);
    calculateDistance(newMarkers);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={4} align="stretch">
        <Heading as="h2" size="lg" textAlign="center">
          World Map Path
        </Heading>
        <Text fontSize="xl" textAlign="center">
          Total Distance: {(totalDistance / 1000).toFixed(2)} km
        </Text>
        <HStack spacing={4} justify="center">
          <Button colorScheme="teal" onClick={resetMarkers}>
            Reset Markers
          </Button>
          <Button colorScheme="teal" onClick={removeLastMarker}>
            Remove Last Marker
          </Button>
        </HStack>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
          <MapContainer
            center={[52.4064, 16.9252]}
            zoom={13}
            style={{ height: "70vh" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapWithPath
              markers={markers}
              polyline={markers}
              onAddMarker={addMarker}
            />
          </MapContainer>
        </Box>
      </VStack>
    </Container>
  );
}

export default App;
