import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";

const UserListItem = ({searchUser, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={searchUser?.name}
        src={searchUser?.pic}
      />
      <Box>
        <Text>{searchUser?.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {searchUser?.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
