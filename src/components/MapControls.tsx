import { Button, HStack, IconButton } from "@chakra-ui/react";
import { FaLocationDot } from "react-icons/fa6";
import { BsSave } from "react-icons/bs";
import { AiOutlineFolder } from "react-icons/ai";

// Interface for basic map control props (teal buttons)
interface BasicControlsProps {
  onGetLocation: () => void;
  onResetMarkers: () => void;
  onRemoveLastMarker: () => void;
}

// Interface for path management props (orange buttons)
interface PathControlsProps {
  onOpenSaveModal: () => void;
  onOpenLoadModal: () => void;
  markersLength: number;
}

// Basic controls component with teal buttons (GPS, Reset, Remove)
export const BasicControls = ({
  onGetLocation,
  onResetMarkers,
  onRemoveLastMarker,
}: BasicControlsProps) => {
  return (
    <HStack spacing={2} justify={"center"}>
      <IconButton
        icon={<FaLocationDot />}
        aria-label="Get Location"
        colorScheme="teal"
        onClick={onGetLocation}
      ></IconButton>
      <Button colorScheme="teal" onClick={onResetMarkers}>
        Reset Markers
      </Button>
      <Button colorScheme="teal" onClick={onRemoveLastMarker}>
        Remove Last Marker
      </Button>
    </HStack>
  );
};

// Path management controls component with orange buttons (Save, Load)
export const PathControls = ({
  onOpenSaveModal,
  onOpenLoadModal,
  markersLength,
}: PathControlsProps) => {
  return (
    <HStack spacing={2} justify={"center"}>
      <Button
        leftIcon={<BsSave />}
        onClick={onOpenSaveModal}
        variant="outline"
        colorScheme="orange"
        isDisabled={markersLength < 2}
      >
        Save path
      </Button>
      <Button
        leftIcon={<AiOutlineFolder />}
        onClick={onOpenLoadModal}
        variant="outline"
        colorScheme="orange"
      >
        Load path
      </Button>
    </HStack>
  );
};
