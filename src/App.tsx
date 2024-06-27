import { createContext, useState } from "react";
import "./App.css";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import Functions from "./components/Functions";
import type { FlowgraphDeclaration } from "yodawg/src/types";
import functions from "./lib/functions.json";
import { FunctionRenderer } from "./components/FunctionRenderer";

export const FunctionsContext = createContext<FlowgraphDeclaration[]>([]);

function App() {
  const [funcId, setFuncId] = useState<string | null>(null);
  const modalController = useDisclosure();

  return (
    <>
      <FunctionsContext.Provider
        value={functions as unknown as FlowgraphDeclaration[]}
      >
        <Modal
          size="6"
          isOpen={modalController.isOpen}
          onClose={modalController.onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Functions
                onSelectFunction={(id) => {
                  setFuncId(id);
                  modalController.onClose();
                }}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
        <Box>
          <Button onClick={modalController.onOpen}>
            Choose existing function
          </Button>
          {funcId && <FunctionRenderer funcId={funcId} />}
        </Box>
      </FunctionsContext.Provider>
    </>
  );
}

export default App;
