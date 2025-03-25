import { useColorMode, useColorModeValue } from '@/components/ui/color-mode';
import { useUserStore } from '@/store/user';
import { Container, VStack, Heading, Box, Input, Button, Image } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster";
import React from 'react';

const RegistrationPage = () => {
  const [newUser, setNewUser] = React.useState({
    name: "",
    email: "",
    password: "",
    image: "",
  });

  const { createUser } = useUserStore();

  const handleAddUser = async () => {
    const { success, message } = await createUser(newUser);
    if (!success) {
      toaster.create({
        title: "Error",
        description: message,
        status: "error",
        type: "error",
        isClosable: true,
      });
    } else {
      toaster.create({
        title: "Success",
        description: message,
        type: "success",
        isClosable: true,
      });
      console.log(message);
      // Reset form after successful registration
      setNewUser({
        name: "",
        email: "",
        password: "",
        image: "",
      });
    }
  };

  return (
    <Container maxW="container.sm">
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Register a New User
        </Heading>
        <Box w={"full"} bg={useColorModeValue("white", "gray.700")} p={6} rounded={"lg"} shadow={"md"}>
          <VStack spacing={4}>
            <Input
              placeholder="Name"
              name="name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <Input
              placeholder="Password"
              name="password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <Input
              placeholder="Image URL"
              name="image"
              value={newUser.image}
              onChange={(e) => setNewUser({ ...newUser, image: e.target.value })}
            />
            <Button colorScheme="teal" size="lg" onClick={handleAddUser} w={"full"}>
              Register
            </Button>
          </VStack>
        </Box>
        
      </VStack>
      <Toaster />
    </Container>
  );
};

export default RegistrationPage;