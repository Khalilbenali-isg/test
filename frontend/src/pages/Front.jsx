import { Box, Button, ButtonGroup, Input, VStack, Steps,Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user";
import { toaster } from "@/components/ui/toaster";
import React from "react";
import { useState, useEffect } from 'react';
import {
    CheckboxCard,
    CheckboxGroup,
    Float,
    Icon,
    SimpleGrid,
  } from "@chakra-ui/react"
  import { HiGlobeAlt, HiLockClosed, HiShieldCheck, HiUser } from "react-icons/hi"

const Front = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginUser, fetchUsers } = useUserStore();
    const [newUser, setNewUser] = React.useState({
    name: "",
    email: "",
    password: "",
    image: "",
  });
  const items = [
    { icon: <HiShieldCheck />, label: "Admin", description: "Give full access" },
    { icon: <HiUser />, label: "User", description: "Give limited access" },
    {
      icon: <HiGlobeAlt />,
      label: "Guest",
      description: "Give read-only access",
    },
    { icon: <HiLockClosed />, label: "Blocked", description: "No access" },
  ]
  
    
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
          navigate('/home');
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
      // Reset 
      setNewUser({
        name: "",
        email: "",
        password: "",
        image: "",
      });
    }
  };
  const steps = [
    {
      title: "Step 1",
      description: "Register",
      content: (
        <VStack spacing={8}>
                <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
                  Register a New User
                </Heading>
                <Box w={"full"}  p={6} rounded={"lg"} shadow={"md"}>
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
      ),
    },
    {
      title: "Step 2",
      description: "Login",
      content: (
        <VStack spacing={8}>
                <Heading as="h1" size="2xl" textAlign="center" mb={8}>
                  Login
                </Heading>
                <Box w="full"  p={6} rounded="lg" shadow="md">
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
      ),
    },
    {
      title: "Step 3",
      description: "Final step",
      content: (
        <CheckboxGroup defaultValue={["Guest"]}>
      <SimpleGrid minChildWidth="200px" gap="2">
        {items.map((item) => (
          <CheckboxCard.Root align="center" key={item.label}>
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control>
              <CheckboxCard.Content>
                <Icon fontSize="2xl" mb="2">
                  {item.icon}
                </Icon>
                <CheckboxCard.Label>{item.label}</CheckboxCard.Label>
                <CheckboxCard.Description>
                  {item.description}
                </CheckboxCard.Description>
              </CheckboxCard.Content>
              <Float placement="top-end" offset="6">
                <CheckboxCard.Indicator />
              </Float>
            </CheckboxCard.Control>
          </CheckboxCard.Root>
        ))}
      </SimpleGrid>
    </CheckboxGroup>
      ),
    },
  ];

  return (
    <Steps.Root defaultStep={1} count={steps.length}>
      <Steps.List>
        {steps.map((step, index) => (
          <Steps.Item key={index} index={index} title={step.title}>
            <Steps.Indicator />
            <Box>
              <Steps.Title>{step.title}</Steps.Title>
              <Steps.Description>{step.description}</Steps.Description>
            </Box>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>

      {steps.map((step, index) => (
        <Steps.Content key={index} index={index}>
          <Box mt={6}>{step.content}</Box>
        </Steps.Content>
      ))}

      <Steps.CompletedContent>
        <Box mt={4}>All steps are complete!</Box>
      </Steps.CompletedContent>

      <ButtonGroup size="sm" variant="outline" mt={4}>
        <Steps.PrevTrigger asChild>
          <Button>Prev</Button>
        </Steps.PrevTrigger>
        <Steps.NextTrigger asChild>
          <Button>Next</Button>
        </Steps.NextTrigger>
      </ButtonGroup>
    </Steps.Root>
  );
};

export default Front;
