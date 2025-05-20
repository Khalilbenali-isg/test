import { useColorModeValue } from '@/components/ui/color-mode';
import { useUserStore } from '@/store/user';
import { Container, VStack, Heading, Box, Input, Button, Text } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavbarClient from "@/items/NavbarClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { requestPasswordReset } = useUserStore();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      toaster.create({
        title: "Error",
        description: "Email is required",
        type: "error",
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    const { success, message } = await requestPasswordReset(email);
    setIsSubmitting(false);

    if (success) {
      setIsSubmitted(true);
      toaster.create({
        title: "Email Sent",
        description: message,
        type: "success",
        isClosable: true,
      });
    } else {
      toaster.create({
        title: "Error",
        description: message,
        type: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.sm">
      <NavbarClient />
      <VStack spacing={8} py={10}>
        <Heading as={"h1"} size={"xl"} textAlign={"center"} mb={4}>
          Reset Your Password
        </Heading>
        
        {isSubmitted ? (
          <>
            <Text textAlign="center" fontSize="md" mb={2}>
              If your email address is registered in our system, you will receive an email with instructions on how to reset your password.
            </Text>
            <Text textAlign="center" fontSize="md" mb={6}>
              Please check your inbox and spam folder.
            </Text>
            <Button 
              colorScheme="teal" 
              size="lg" 
              onClick={() => navigate('/login')} 
              w={"full"}
            >
              Return to Login
            </Button>
          </>
        ) : (
          <Box w={"full"} bg={useColorModeValue("white", "gray.700")} p={6} rounded={"lg"} shadow={"md"}>
            <VStack spacing={6}>
              <Text textAlign="center" fontSize="md" mb={2}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>
              
              <Input
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <Button 
                colorScheme="teal" 
                size="lg" 
                onClick={handleSubmit}
                isLoading={isSubmitting}
                loadingText="Sending..."
                w={"full"}
              >
                Send Reset Link
              </Button>
              
              <Text fontSize="sm" textAlign="center">
                Remember your password?{' '}
                <Link to="/login" style={{ color: '#38A169' }}>
                  Log in
                </Link>
              </Text>
            </VStack>
          </Box>
        )}
      </VStack>
      <Toaster />
    </Container>
  );
};

export default ForgotPassword;