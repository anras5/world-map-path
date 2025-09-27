import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLng } from "leaflet";
import * as turf from "@turf/turf";
import {
  Box,
  Container,
  Heading,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import SavePathModal from "./components/SavePathModal";
import LoadPathModal from "./components/LoadPathModal";
import UserGuideModal from "./components/UserGuideModal";
import MapWithPath from "./components/MapWithPath";
import { BasicControls, PathControls } from "./components/MapControls";

function App() {
  const [markers, setMarkers] = useState<LatLng[]>([]);
  const [center, setCenter] = useState<LatLng>(new LatLng(52.4064, 16.9252));
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const {
    isOpen: isSaveModalOpen,
    onOpen: onOpenSaveModal,
    onClose: onCloseSaveModal,
  } = useDisclosure();
  const {
    isOpen: isLoadModalOpen,
    onOpen: onOpenLoadModal,
    onClose: onCloseLoadModal,
  } = useDisclosure();
  const {
    isOpen: isUserGuideOpen,
    onOpen: onOpenUserGuide,
    onClose: onCloseUserGuide,
  } = useDisclosure();

  // Core functionality
  // Calculate the total distance of a path
  const calculateDistance = useCallback((markers: LatLng[]) => {
    let distance = 0;
    for (let i = 0; i < markers.length - 1; i++) {
      const from = turf.point([markers[i].lng, markers[i].lat]);
      const to = turf.point([markers[i + 1].lng, markers[i + 1].lat]);
      distance += turf.distance(from, to, { units: "meters" });
    }
    setTotalDistance(distance);
  }, []);

  // Add a new marker to the path
  const addMarker = useCallback(
    (latlng: LatLng) => {
      const newMarkers = [...markers, latlng];
      setMarkers(newMarkers);
      calculateDistance(newMarkers);
    },
    [markers, calculateDistance],
  );

  const resetMarkers = useCallback(() => {
    setMarkers([]);
    setTotalDistance(0);
  }, []);

  const removeLastMarker = useCallback(() => {
    if (markers.length > 0) {
      const newMarkers = [...markers];
      newMarkers.pop();
      setMarkers(newMarkers);
      calculateDistance(newMarkers);
    }
  }, [markers, calculateDistance]);

  const getLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const latlng = new LatLng(
        position.coords.latitude,
        position.coords.longitude,
      );
      addMarker(latlng);
      setCenter(latlng);
    });
  }, [addMarker, setCenter]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Z or Cmd+Z
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        event.preventDefault();
        removeLastMarker();
      }

      // Check for Ctrl+S or Cmd+S
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        if (markers.length >= 2) {
          onOpenSaveModal();
        }
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [removeLastMarker, onOpenSaveModal, markers]);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={4} align="stretch">
        <Heading as="h2" size="lg" textAlign="center">
          World Map Path
        </Heading>
        <Text fontSize="xl" textAlign="center">
          Total Distance: {(totalDistance / 1000).toFixed(2)} km
        </Text>

        <BasicControls
          onGetLocation={getLocation}
          onResetMarkers={resetMarkers}
          onRemoveLastMarker={removeLastMarker}
        />

        <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
          <MapContainer center={center} zoom={15} style={{ height: "70vh" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapWithPath
              markers={markers}
              polyline={markers}
              onAddMarker={addMarker}
              center={center}
            />
          </MapContainer>
        </Box>

        <PathControls
          onOpenSaveModal={onOpenSaveModal}
          onOpenLoadModal={onOpenLoadModal}
          markersLength={markers.length}
        />

        {/* Modals */}
        <SavePathModal
          isOpen={isSaveModalOpen}
          onClose={onCloseSaveModal}
          markers={markers}
          totalDistance={totalDistance}
        />
        <LoadPathModal
          isOpen={isLoadModalOpen}
          onClose={onCloseLoadModal}
          onLoadPath={(loadedMarkers) => {
            setMarkers(loadedMarkers);
            calculateDistance(loadedMarkers);

            // If markers exist, center on the first marker
            if (loadedMarkers.length > 0) {
              setCenter(loadedMarkers[0]);
            }
          }}
        />
        <UserGuideModal isOpen={isUserGuideOpen} onClose={onCloseUserGuide} />
      </VStack>

      {/* Footer */}
      <Box as="footer" mt={8} textAlign="center" pb={4}>
        <Text
          as="span"
          color="teal.500"
          cursor="pointer"
          textDecoration="underline"
          fontWeight="medium"
          onClick={onOpenUserGuide}
        >
          How to use?
        </Text>
      </Box>
    </Container>
  );
}

export default App;
