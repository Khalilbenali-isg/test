import { useColorModeValue } from '@/components/ui/color-mode';
import { useUserStore } from '@/store/user';
import { Container, VStack, Heading, Box, Input, Button, Image, Text } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster";
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarClient from "@/items/NavbarClient";

const RegistrationPage = () => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "client"
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const { createUser } = useUserStore();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    
    
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !imageFile) {
      toaster.create({
        title: "Error",
        description: "All fields are required",
        type: "error",
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await createUser({
        ...newUser,
        image: imageFile
      });
      
      if (!result.success) {
        toaster.create({
          title: "Error",
          description: result.message,
          type: "error",
          isClosable: true,
        });
      } else {
        toaster.create({
          title: "Success",
          description: "Registration successful! Please check your email for verification code.",
          type: "success",
          isClosable: true,
        });
        
        navigate(`/verify`);
        
        
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        
        setNewUser({
          name: "",
          email: "",
          password: "",
          role: "client"
        });
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toaster.create({
        title: "Error",
        description: "Something went wrong during registration",
        type: "error",
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.sm">
      <NavbarClient/>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Register a New Account
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
            
            
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            
            
            <Button 
              onClick={triggerFileInput} 
              colorScheme="blue" 
              w="full"
            >
              {imageFile ? 'Change Image' : 'Upload Profile Image'}
            </Button>
            
            {imageFile && (
              <Text fontSize="sm" mt={2}>
                Selected file: {imageFile.name}
              </Text>
            )}
            
           
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Profile Preview"
                boxSize="150px"
                objectFit="cover"
                borderRadius="full"
                mt={2}
              />
            )}

            <Button 
              colorScheme="teal" 
              size="lg" 
              onClick={handleAddUser} 
              w={"full"} 
              isLoading={isLoading}
              loadingText="Registering..."
            >
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