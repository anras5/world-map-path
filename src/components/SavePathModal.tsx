import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { LatLng } from "leaflet";

interface SavePathModalProps {
  isOpen: boolean;
  onClose: () => void;
  markers: LatLng[];
  totalDistance: number;
}

const SavePathModal = ({
  isOpen,
  onClose,
  markers,
  totalDistance,
}: SavePathModalProps) => {
  const [pathName, setPathName] = useState("");
  const [error, setError] = useState("");
  const toast = useToast();

  const handleSave = () => {
    if (!pathName.trim()) {
      setError("Path name is required");
      return;
    }

    // Get existing paths from localStorage
    const savedPaths = JSON.parse(localStorage.getItem("savedPaths") || "{}");

    // Check if path name already exists
    if (savedPaths[pathName]) {
      setError("A path with this name already exists");
      return;
    }

    // Format markers for storage
    const markersForStorage = markers.map((marker) => ({
      lat: marker.lat,
      lng: marker.lng,
    }));

    // Save path to localStorage
    savedPaths[pathName] = {
      markers: markersForStorage,
      distance: totalDistance,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("savedPaths", JSON.stringify(savedPaths));

    // Show success toast
    toast({
      title: "Path saved",
      description: `"${pathName}" has been saved successfully`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Reset form and close modal
    setPathName("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Save Path</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Path Name</FormLabel>
            <Input
              placeholder="Enter a unique name for your path"
              value={pathName}
              onChange={(e) => {
                setPathName(e.target.value);
                setError("");
              }}
            />
            {error && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {error}
              </Text>
            )}
          </FormControl>

          <Text mt={4} fontSize="sm" color="gray.600">
            This will save a path with {markers.length} markers and a total
            distance of {(totalDistance / 1000).toFixed(2)} km.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="orange" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SavePathModal;
