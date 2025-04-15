import { Box, Flex, Image, Text, Button, Portal } from "@chakra-ui/react";
import { useUserStore } from "@/store/user";
import { useNavigate } from "react-router-dom";
import {Menu, } from "@chakra-ui/react"
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode"


const Navbar = () => {
  const { loggedInUser, logout } = useUserStore();
  const navigate = useNavigate();
  const { toggleColorMode } = useColorMode()
  
    const bg = useColorModeValue("white", "gray.800")
    const color = useColorModeValue("white", "gray.800")
  return (
    <Flex
      justify="space-between"
      align="center"
      p={4}
      
      
      w="100%"
    >
      <Text
        fontSize="2xl"
        fontWeight="bold"
        cursor="pointer"
        onClick={() => navigate("/home")}
      >
        My Store
      </Text>

      <Flex gap={6}>
      
        <Text variant="link" cursor="pointer" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })} >
          Store
        </Text>
        <Text variant="link" cursor="pointer" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>
          About Us
        </Text>
        <Text variant="link" cursor="pointer" onClick={() => document.getElementById('footer').scrollIntoView({ behavior: 'smooth' })}>
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
                <Menu.Item value="modify" onClick={() => navigate("/users/ModifyProfile")}>
                  Modify Account
                </Menu.Item>
                <Menu.Item
                  value="logout"
                  onClick={() => {
                    logout();
                    navigate("/users/login");
                  }}
                >
                  
                  Logout
                </Menu.Item>
                <Menu.Item value="toggle" onClick={toggleColorMode}>
                  Toggle Color Mode
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
