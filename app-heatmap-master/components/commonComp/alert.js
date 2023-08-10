import React, { useDisclosure, useState } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

function AlertDialogExample() {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef();

  return (
    <>
      <Button
        colorScheme="red"
        style={{
          marginLeft: "5px",
          marginTop: "-5px",
          fontSize: "16px",
          padding: "16px 20px",
          border: "1px solid transparent",
          borderRadius: "5px",
        }}
        onClick={() => {
          window.open(
            "https://www.youtube.com/watch?v=Bn25OtwLoJI&feature=youtu.be",
            "_blank"
          );
        }}
      >
        Watch Setup Demo
      </Button>

      {/* <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
         
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
             
              <AlertDialogBody
               fontSize="22px"
               fontWeight="700"
               color={"#555"}
               paddingTop={"8px"}
               paddingBottom={"8px"}>
                Please refer a video to get clear understanding of wishlist app.
              </AlertDialogBody>
  
              <AlertDialogFooter paddingTop={"4px"} paddingBottom={"12px"}>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
                <Button colorScheme='red'  ml={3} onClick={()=>{
                  window.open("https://www.youtube.com/watch?v=Ry0cUga7xxs", "_blank") }} >
                  Click
                </Button>
                
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog> */}
    </>
  );
}
export default AlertDialogExample;
