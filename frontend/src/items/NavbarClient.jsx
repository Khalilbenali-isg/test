import { Box, Flex, Image, Text, Button, Portal } from "@chakra-ui/react";
import { useUserStore } from "@/store/user";
import { useNavigate } from "react-router-dom";
import {Menu, } from "@chakra-ui/react"


const Navbar = () => {
  const { loggedInUser, logout } = useUserStore();
  const navigate = useNavigate();

  return (
    <Flex
      justify="space-between"
      align="center"
      p={4}
      shadow="md"
      
      w="100%"
    >
      <Text
        fontSize="2xl"
        fontWeight="bold"
        cursor="pointer"
        onClick={() => navigate("/")}
      >
        My Store
      </Text>

      <Flex gap={6}>
        <Text cursor="pointer" onClick={() => navigate("/")}>
          Store
        </Text>
        <Text cursor="pointer" onClick={() => navigate("/#about")}>
          About Us
        </Text>
        <Text cursor="pointer" onClick={() => navigate("/#feedback")}>
          Feedback
        </Text>
      </Flex>

      {loggedInUser ? (
        <Menu.Root>
          <Menu.Trigger asChild>
            <Image
              src={loggedInUser.image}
              alt="user-avatar"
              boxSize="45px"
              borderRadius="full"
              cursor="pointer"
            />
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="modify" onSelect={() => navigate("/users/ModifyProfile")}>
                  Modify Account
                </Menu.Item>
                <Menu.Item
                  value="logout"
                  onSelect={() => {
                    logout();
                    navigate("/users/login");
                  }}
                >
                  Logout
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      ) : (
        <Button onClick={() => navigate("/users/login")}>Login</Button>
      )}
    </Flex>
  );
};

export default Navbar;
