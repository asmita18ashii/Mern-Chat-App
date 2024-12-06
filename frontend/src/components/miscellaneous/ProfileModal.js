import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { useEffect, useState } from "react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import axios from "axios";
const baseURL = process.env.REACT_APP_BASE_URL;


const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const toast = useToast();
  const [loggedUser, setLoggedUser] = useState();


  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    // eslint-disable-next-line
  }, []);

  const updateProfile = async () => {
    setPicLoading(true);
    if (!name || !pic) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }

    try {
      const email = loggedUser?.email
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };
      const { data } = await axios.put(
        `${baseURL}/user/update-profile`,
        {
          email,
          name,
          pic,
        },
        config
      );

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      data['token']=loggedUser?.token
      setLoggedUser(data)
      user=data
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      setIsEdit(false)
    } catch (error) {

    }
  }

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const timeStamp = new Date();
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      // data.append("api_key", "938119958924544");
      // data.append("signature","MZFeEEB4uIFfkultvPhWD9BToh4")
      // data.append("timestamp",timeStamp)
      fetch("https://api.cloudinary.com/v1_1/asmitacloud/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };



  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      {isEdit ? (
        <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered >
          <ModalOverlay />
          <ModalContent h="410px" display={"flex"} flexDirection={"column"} p={"10px"}>
            <ModalCloseButton />

            <Box marginBottom={"10px"} backgroundColor={"black"} width={"100%"} h={"100%"} p={"10px"} borderRadius={"5px"}>
              <FormControl id="first-name" isRequired >
                <FormLabel background={"white"}>Name</FormLabel>
                <Input
                  background={"white"}
                  placeholder="Enter Your Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

              <FormControl id="pic">
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                  type="file"
                  p={0.9}
                  accept="image/*"
                  onChange={(e) => postDetails(e.target.files[0])}
                  _focus={{
                    shadow: "none",
                    boxShadow: "none"
                  }}
                  _active={{
                    shadow: "none",
                    boxShadow: "none"
                  }}
                />
              </FormControl>
            </Box>

            <ModalFooter p={0} gap={"10px"}>
              <Button
                backgroundColor="black"
                borderColor="rgb(6, 36, 101)"
                color="white"
                borderWidth="2px"
                width="50%"
                _hover={{
                  bg: "rgb(6, 36, 101)", // Background color on hover
                }}
                _active={{
                  bg: "rgb(6, 36, 101)", // Background color on hover
                }}
                onClick={onClose}>Close</Button>
              <Button
                backgroundColor="black"
                borderColor="rgb(6, 36, 101)"
                color="white"
                borderWidth="2px"
                width="50%"
                isLoading={picLoading}
                onClick={updateProfile}
                _hover={{
                  bg: "rgb(6, 36, 101)", // Background color on hover
                }}
                _active={{
                  bg: "rgb(6, 36, 101)", // Background color on hover
                }}>Save</Button>
            </ModalFooter>
          </ModalContent>

        </Modal>
      ) : (
        <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent h="410px">
            <ModalHeader
              fontSize="40px"
              fontFamily="Work sans"
              display="flex"
              justifyContent="center"
            >
              {user.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
            >
              <Image
                borderRadius="full"
                boxSize="150px"
                src={user.pic}
                alt={user.name}
              />

              <Text
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
              >
                Email: {user.email}
              </Text>
            </ModalBody>
            <ModalFooter gap={"10px"}>
              <Button onClick={onClose}>Close</Button>
              {loggedUser?._id==user._id?(<Button onClick={() => setIsEdit(true)}>Edit</Button>):(<></>)}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ProfileModal;
