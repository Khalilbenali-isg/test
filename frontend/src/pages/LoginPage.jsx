import { useColorModeValue } from '@/components/ui/color-mode';
import { useUserStore } from '@/store/user';
import { Container, VStack, Heading, Box, Input, Button, Text, Link, Toast } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster";
import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import NavbarClient from "@/items/NavbarClient";

const LoginPage = () => {
  const [credentials, setCredentials] = React.useState({
    email: "",
    password: "",
  });

  const { loginUser } = useUserStore();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = await loginUser(credentials.email, credentials.password);
    
    if (result.success) {
      toaster.create({
        title: "Success",
        description: result.message,
        type: "success",
        isClosable: true,
      });
      
      
      if (result.role === 'admin') {
        navigate('/');
      } else {
        navigate('/home');
      }
    } else {
      
      if (result.requiresVerification) {
        toaster.create({
          title: "Account Not Verified",
          description: result.message,
          type: "warning",
          isClosable: true,
        });
        
        
        navigate(`/verify`);
      } else {
        toaster.create({
          title: "Error",
          description: result.message,
          type: "error",
          isClosable: true,
        });
      }
    }
  };

  return (
    <Container maxW="container.sm">
      <Toaster />
      <NavbarClient/>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Login
        </Heading>
        <Box
          as="form"
          w={"full"}
          bg={useColorModeValue("white", "gray.700")}
          p={6}
          rounded={"lg"}
          shadow={"md"}
          onSubmit={(e) => {
            e.preventDefault(); 
            handleLogin();     
          }}
        >
          <VStack spacing={4}>
            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
            <Input
              placeholder="Password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <Button colorScheme="teal" size="lg" type="submit" w={"full"}>
              Login
            </Button>
            <Text mt={4}>
              Don't have an account?{" "}
              <Link as={RouterLink} to="/users/create" color="teal.500">
                Register here
              </Link>
            </Text>
            <Text mt={4}>
              forgot password ?{" "}
              <Link as={RouterLink} to="/forgot-password" color="teal.500">
                click here
              </Link>
            </Text>
          </VStack>
        </Box>

      </VStack>
      <Toaster /> 
    </Container>
  );
};

export default LoginPage;