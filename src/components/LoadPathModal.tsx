import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
  Box,
  HStack,
  Icon,
  useToast,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { BsArrowRight } from "react-icons/bs";
import { useState, useEffect } from "react";
import { LatLng } from "leaflet";

interface SavedPath {
  markers: { lat: number; lng: number }[];
  distance: number;
  createdAt: string;
}

interface SavedPathsRecord {
  [key: string]: SavedPath;
}

interface LoadPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadPath: (markers: LatLng[]) => void;
}

const LoadPathModal = ({ isOpen, onClose, onLoadPath }: LoadPathModalProps) => {
  const [savedPaths, setSavedPaths] = useState<SavedPathsRecord>({});
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      // Load saved paths from localStorage when modal opens
      const paths = JSON.parse(localStorage.getItem("savedPaths") || "{}");
      setSavedPaths(paths);
    }
  }, [isOpen]);

  const handleLoadPath = (pathName: string) => {
    const path = savedPaths[pathName];
    if (!path) return;

    // Convert saved markers to LatLng objects
    const loadedMarkers = path.markers.map(
      (marker) => new LatLng(marker.lat, marker.lng)
    );

    // Call the onLoadPath function with the loaded markers
    onLoadPath(loadedMarkers);

    // Show success toast
    toast({
      title: "Path loaded",
      description: `"${pathName}" has been loaded successfully`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Close the modal
    onClose();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Load Saved Path</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {Object.keys(savedPaths).length === 0 ? (
            <Text color="gray.500" textAlign="center" py={4}>
              No saved paths found
            </Text>
          ) : (
            <VStack spacing={2} align="stretch" maxHeight="60vh" overflowY="auto">
              {Object.entries(savedPaths).map(([name, path], index) => (
                <Box key={name}>
                  {index > 0 && <Divider my={2} />}
                  <HStack justifyContent="space-between" p={2}>
                    <VStack align="flex-start" spacing={0}>
                      <Text fontWeight="bold">{name}</Text>
                      <Text fontSize="xs" color="gray.500">
                        Created: {formatDate(path.createdAt)}
                      </Text>
                      <Badge colorScheme="teal" mt={1} size="sm">
                        {path.markers.length} markers • {(path.distance / 1000).toFixed(2)} km
                      </Badge>
                    </VStack>
                    <Button
                      rightIcon={<Icon as={BsArrowRight} />}
                      colorScheme="orange"
                      size="sm"
                      onClick={() => handleLoadPath(name)}
                    >
                      Load
                    </Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoadPathModal;
