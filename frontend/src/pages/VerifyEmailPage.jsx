import { useColorModeValue } from '@/components/ui/color-mode';
import { useUserStore } from '@/store/user';
import { Container, VStack, Heading, Box, Input, Button, Text, HStack, Spinner } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster";
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavbarClient from "@/items/NavbarClient";

const VerifyEmailPage = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const { verifyUserEmail, resendVerification } = useUserStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    console.log('Store functions:', Object.keys(useUserStore.getState()));
  }, []);
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleVerify = async () => {
    if (!email || !verificationCode || verificationCode.length !== 6) {
      toaster.create({
        title: "Error",
        description: "Email and 6-digit verification code are required",
        type: "error",
        isClosable: true,
      });
      return;
    }

    const { success, message } = await verifyUserEmail(email, verificationCode);
    if (success) {
      toaster.create({
        title: "Success",
        description: message,
        type: "success",
        isClosable: true,
      });
      setTimeout(() => navigate('/home'), 2000);
    } else {
      toaster.create({
        title: "Error",
        description: message,
        type: "error",
        isClosable: true,
      });
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toaster.create({
        title: "Error",
        description: "Email is required",
        type: "error",
        isClosable: true,
      });
      return;
    }

    setIsResending(true);
    const { success, message } = await resendVerification(email);
    setIsResending(false);
    
    toaster.create({
      title: success ? "Success" : "Error",
      description: message,
      type: success ? "success" : "error",
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.sm">
      <NavbarClient />
      <VStack spacing={8} py={10}>
        <Heading as={"h1"} size={"xl"} textAlign={"center"} mb={4}>
          Verify Your Email
        </Heading>
        <Text textAlign="center" fontSize="md" mb={2}>
          We've sent a verification code to your email. Please enter the 6-digit code below to verify your account.
        </Text>
        <Box w={"full"} bg={useColorModeValue("white", "gray.700")} p={6} rounded={"lg"} shadow={"md"}>
          <VStack spacing={6}>
            <Input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!!searchParams.get('email')}
            />
            <Text fontSize="sm">Enter the 6-digit verification code:</Text>
            <Input
              placeholder="Verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              type="text"
              textAlign="center"
              letterSpacing="0.5em"
              fontWeight="bold"
            />
            <Button 
              colorScheme="teal" 
              size="lg" 
              onClick={handleVerify} 
              w={"full"}
            >
              Verify Email
            </Button>
            
            <HStack spacing={2} align="center" justify="center" w="full">
              <Text fontSize="sm">Didn't receive a code?</Text>
              <Button
                variant="link"
                colorScheme="blue"
                onClick={handleResendCode}
                isLoading={isResending}
                loadingText="Sending..."
                disabled={isResending}
              >
                Resend Code
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
      <Toaster />
    </Container>
  );
};

export default VerifyEmailPage;