import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Icon,
  Flex
  
} from '@chakra-ui/react';
import {  useColorModeValue } from "@/components/ui/color-mode"
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/user';
import NavbarClient from "@/items/NavbarClient";
import { FaLock, FaHome, FaUser } from 'react-icons/fa';

const RestrictedPage = () => {
  const navigate = useNavigate();
  const { loggedInUser } = useUserStore();
  const bgGradient = useColorModeValue(
    "linear(to-b, red.50, orange.50)",
    "linear(to-b, red.900, orange.900)"
  );
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("red.100", "red.700");

  if (!loggedInUser) {
    navigate('/users/login');
    return null;
  }

  return (
    <Container maxW="container.lg" py={12}>
      <NavbarClient />
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="70vh"
        bgGradient={bgGradient}
        p={8}
        borderRadius="lg"
      >
        <VStack spacing={6} textAlign="center">
          <Icon as={FaLock} w={20} h={20} color="red.500" />
          
          <Heading as="h1" size="2xl">
            Access Restricted
          </Heading>
          
          <Text fontSize="xl" maxW="600px">
            Sorry, {loggedInUser.name}. This area is only accessible to administrators. 
            Client accounts don't have permission to access the admin dashboard.
          </Text>
          
          <Box
            bg={cardBg}
            p={6}
            borderRadius="md"
            shadow="md"
            borderWidth="1px"
            borderColor={borderColor}
            w="full"
            maxW="600px"
          >
            <VStack spacing={4}>
              <Heading size="md">What you can do instead:</Heading>
              <Text>
                As a client, you can still browse products, update your profile, and place orders.
                Please use the navigation options below to continue using the features available to you.
              </Text>
              
              <Flex
                width="full"
                direction={{ base: "column", sm: "row" }}
                justify="center"
                gap={4}
                mt={4}
              >
                <Button
                  leftIcon={<FaHome />}
                  colorScheme="teal"
                  size="lg"
                  onClick={() => navigate('/home')}
                  width={{ base: "full", sm: "auto" }}
                >
                  Client Home
                </Button>
                
              </Flex>
            </VStack>
          </Box>
        </VStack>
      </Flex>
    </Container>
  );
};

export default RestrictedPage;