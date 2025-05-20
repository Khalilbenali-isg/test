import { Box, Flex, Image, Text, Button, Portal } from "@chakra-ui/react";
import { useUserStore } from "@/store/user";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import { useEffect } from "react";

const Navbar = () => {
  const { loggedInUser, logout, loadUserFromToken } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleColorMode } = useColorMode();

  useEffect(() => {
    loadUserFromToken();
  }, []);

  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("white", "gray.800");

  const handleScroll = (sectionId) => {
    if (location.pathname !== "/home") {
      navigate("/home", {
        state: { scrollTo: sectionId }
      });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (location.pathname === "/home" && location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      const timer = setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <Flex justify="space-between" align="center" p={4} w="100%">
      <Text
        fontSize="2xl"
        fontWeight="bold"
        cursor="pointer"
        onClick={() => navigate("/home")}
      >
        My Store
      </Text>

      <Flex gap={6}>
        <Text variant="link" cursor="pointer" onClick={() => handleScroll('products')}>
          Store
        </Text>
        <Text variant="link" cursor="pointer" onClick={() => handleScroll('about')}>
          About Us
        </Text>
        <Text variant="link" cursor="pointer" onClick={() => handleScroll('feedback')}>
          Feedback
        </Text>
        <Text variant="link" cursor="pointer" onClick={() => navigate("/UserProductsPage")}>
          My Products
        </Text>
        <Text variant="link" cursor="pointer" onClick={() => navigate("/games")}>
          games
        </Text>
        
        {loggedInUser?.role === "admin" && (
          <Text variant="link" cursor="pointer" onClick={() => navigate("/")}>
            Dashboard
          </Text>
        )}
      </Flex>

      {loggedInUser ? (
        <Menu.Root>
          <Menu.Trigger asChild>
            <Image
              src={`http://localhost:5000${loggedInUser.image}`}
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