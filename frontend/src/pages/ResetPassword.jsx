import { useColorModeValue } from '@/components/ui/color-mode';
import { useUserStore } from '@/store/user';
import { Container, VStack, Heading, Box, Input, Button, Text, InputGroup } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster";
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { Alert } from "@chakra-ui/react";
import NavbarClient from "@/items/NavbarClient";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useUserStore();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenError, setTokenError] = useState('');

  useEffect(() => {
    if (!token) {
      setTokenError('Invalid or missing reset token');
    }
  }, [token]);

  const validateForm = () => {
    if (!password) {
      toaster.create({
        title: "Error",
        description: "Password is required",
        type: "error",
        isClosable: true,
      });
      return false;
    }

    if (password.length < 6) {
      toaster.create({
        title: "Error",
        description: "Password must be at least 6 characters",
        type: "error",
        isClosable: true,
      });
      return false;
    }

    if (password !== confirmPassword) {
      toaster.create({
        title: "Error",
        description: "Passwords do not match",
        type: "error",
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const { success, message } = await resetPassword(token, password);
      
      if (success) {
        setIsSuccess(true);
        toaster.create({
          title: "Success",
          description: message,
          type: "success",
          isClosable: true,
        });
        setTimeout(() => navigate('/users/login'), 3000);
      } else {
        toaster.create({
          title: "Error",
          description: message,
          type: "error",
          isClosable: true,
        });
      }
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        type: "error",
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenError) {
    return (
      <Container maxW="container.sm">
        <VStack spacing={8} py={10}>
          <Alert.Root status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" borderRadius="lg" py={6}>
          <Alert.Indicator />
            <Alert.Content>
            <Alert.Title mt={4} mb={1} fontSize="lg">Invalid Reset Link</Alert.Title>
            <Alert.Description maxW="sm">
              The password reset link is invalid or has expired. Please request a new password reset link.
            </Alert.Description>
            </Alert.Content>
            <Button as={Link} to="/forgot-password" colorScheme="red" mt={4}>
              Request New Reset Link
            </Button>
          </Alert.Root>
        </VStack>
        <Toaster />
      </Container>
    );
  }

  return (
    <Container maxW="container.sm">
      <NavbarClient />
      <VStack spacing={8} py={10}>
        <Heading as="h1" size="xl" textAlign="center" mb={4}>
          Set New Password
        </Heading>
        
        {isSuccess ? (
          <Box w="full" bg={useColorModeValue("white", "gray.700")} p={6} rounded="lg" shadow="md">
            <VStack spacing={6}>
              <Alert status="success" borderRadius="md">
                
                Password reset successful!
              </Alert>
              <Text>You will be redirected to the login page in a few seconds...</Text>
              <Button as={Link} to="/users/login" colorScheme="teal" w="full">
                Go to Login
              </Button>
            </VStack>
          </Box>
        ) : (
            <Box w="full" bg={useColorModeValue("white", "gray.700")} p={6} rounded="lg" shadow="md">
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <Text textAlign="center">
                  Please enter your new password below.
                </Text>

                
                <Box position="relative" w="full">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    pr="4rem"
                    isRequired
                  />
                  <Button
                    position="absolute"
                    top="50%"
                    right="0.5rem"
                    transform="translateY(-50%)"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaRegEye />}
                  </Button>
                </Box>

                
                <Box position="relative" w="full">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    pr="4rem"
                    isRequired
                  />
                  <Button
                    position="absolute"
                    top="50%"
                    right="0.5rem"
                    transform="translateY(-50%)"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaRegEye />}
                  </Button>
                </Box>

                <Button
                  isLoading={isSubmitting}
                  loadingText="Resetting..."
                  type="submit"
                  colorScheme="teal"
                  size="lg"
                  w="full"
                >
                  Reset Password
                </Button>
              </VStack>
            </form>
          </Box>
        )}
      </VStack>
      <Toaster />
    </Container>
  );
};

export default ResetPassword;