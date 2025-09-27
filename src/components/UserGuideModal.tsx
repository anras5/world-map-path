import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  Heading,
  Divider,
  Box,
  Kbd,
  HStack,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserGuideModal = ({ isOpen, onClose }: UserGuideModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>How to Use World Map Path</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Box>
              <Heading size="md" mb={2}>
                About
              </Heading>
              <Text>
                World Map Path is a simple application that allows you to create,
                save, and manage paths on a world map. You can mark locations,
                calculate distances, and share paths with others.
              </Text>
            </Box>

            <Divider />

            <Box>
              <Heading size="md" mb={2}>
                Creating Paths
              </Heading>
              <UnorderedList spacing={2}>
                <ListItem>
                  Click anywhere on the map to add a marker to your path
                </ListItem>
                <ListItem>
                  Use the <Kbd>GPS</Kbd> button to add your current location as a
                  marker
                </ListItem>
                <ListItem>
                  The total distance of your path is displayed at the top of the
                  page
                </ListItem>
                <ListItem>
                  Use <Kbd>Reset Markers</Kbd> to clear all markers
                </ListItem>
                <ListItem>
                  Use <Kbd>Remove Last Marker</Kbd> to delete the most recently
                  added marker
                </ListItem>
              </UnorderedList>
            </Box>

            <Divider />

            <Box>
              <Heading size="md" mb={2}>
                Saving & Loading Paths
              </Heading>
              <UnorderedList spacing={2}>
                <ListItem>
                  Click <Kbd>Save path</Kbd> to store your current path with a
                  unique name
                </ListItem>
                <ListItem>
                  Click <Kbd>Load path</Kbd> to view, load, or delete previously
                  saved paths
                </ListItem>
                <ListItem>
                  In the load dialog, you can copy paths to clipboard for sharing
                </ListItem>
                <ListItem>
                  You can also import paths from clipboard that others have
                  shared with you
                </ListItem>
              </UnorderedList>
            </Box>

            <Divider />

            <Box>
              <Heading size="md" mb={2}>
                Keyboard Shortcuts
              </Heading>
              <VStack align="stretch" spacing={2}>
                <HStack>
                  <Box w="120px">
                    <Kbd>Ctrl</Kbd> + <Kbd>Z</Kbd>
                  </Box>
                  <Text>Remove last marker</Text>
                </HStack>
                <HStack>
                  <Box w="120px">
                    <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>
                  </Box>
                  <Text>Open save path dialog</Text>
                </HStack>
              </VStack>
              <Text fontSize="sm" mt={2} fontStyle="italic">
                Note: On Mac, use <Kbd>⌘</Kbd> instead of <Kbd>Ctrl</Kbd>
              </Text>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserGuideModal;
