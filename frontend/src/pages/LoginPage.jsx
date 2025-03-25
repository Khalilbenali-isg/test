import { useColorModeValue } from '@/components/ui/color-mode';
import { useUserStore } from '@/store/user';
import { Container, VStack, Heading, Box, Input, Button } from '@chakra-ui/react';
import { toaster } from "@/components/ui/toaster";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import NavbarClient from "@/items/NavbarClient";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser, fetchUsers } = useUserStore();
  const navigate = useNavigate();

  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      
      const result = await loginUser(email, password);
      
      if (result.success) {
        toaster.create({
          title: "Success",
          description: "Login successful",
          type: "success",
          isClosable: true
        });
        navigate('/');
      } else {
        toaster.create({
          title: "Error",
          description: "Invalid email or password",
          type: "error",
          isClosable: true
        });
      }
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "An error occurred during login",
        type: "error",
        isClosable: true
      });
    }
  };

  return (
    <Container maxW="container.sm">
        <NavbarClient/>
      <VStack spacing={8}>
        <Heading as="h1" size="2xl" textAlign="center" mb={8}>
          Login
        </Heading>
        <Box w="full" bg={useColorModeValue("white", "gray.700")} p={6} rounded="lg" shadow="md">
          <VStack spacing={4} as="form" onSubmit={handleLogin}>
            <Input 
              placeholder="Email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <Input 
              placeholder="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <Button type="submit" colorScheme="teal" size="lg" w="full">
              Login
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default LoginPage;