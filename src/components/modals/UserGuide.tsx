import {
  Button,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { Languages } from "../../utils/constants";

const UserGuide: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button variant="link" onClick={onOpen} fontWeight="normal">
        View User Guide
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Guide</ModalHeader>
          <ModalCloseButton />
          <ModalBody paddingBottom={0}>
            <OrderedList>
              <ListItem>
                Connect your SPIKE Prime to your computer via USB.
                <br />
                <em>
                  <strong>Note:</strong> You can also connect via Bluetooth but
                  reliability will not be guaranteed.
                </em>
              </ListItem>
              <ListItem>
                Select the appropriate language mode:{" "}
                {Languages.SOURCE_THREE_INTERPRETER} or {Languages.PYTHON}
              </ListItem>
              <ListItem>
                After finishing your code, click the "Run on Device" button.
              </ListItem>
              <ListItem>
                Select the correct port from the pop-up that is shown.
                <br />
                <em>
                  <strong>Note:</strong> SEKER only supports Chromium-based
                  browsers version 89 and onwards. If you do not see a pop-up,
                  this means your browser is not supported.
                </em>
              </ListItem>
              <ListItem>
                The SPIKE Prime should start running your code.
              </ListItem>
            </OrderedList>
          </ModalBody>
          <ModalFooter paddingTop={0} />
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserGuide;
