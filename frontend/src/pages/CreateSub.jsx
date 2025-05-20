import { useColorMode, useColorModeValue } from '@/components/ui/color-mode';
import { useSubscriptionStore } from '@/store/Subscription'; 
import { VStack, Heading, Box, Input, Button, Image, HStack, Flex } from '@chakra-ui/react';
import { toaster } from "@/components/ui/toaster";
import React from 'react';
import { CheckboxCard } from "@chakra-ui/react";
import NavbarSub from '@/items/NavbarSub'
import Sidebar from '@/items/Sidebar';

const CreateSub = () => {
  const [newSubscription, setNewSubscription] = React.useState({
    name: "",
    price: "",
    durationInDays: "",
    options: {
      autoSpray: false,
      heatCalculator: false,
      optionA: false,
      optionB: false,
    },
  });

  const { createSubscription } = useSubscriptionStore();

  const handleAddSubscription = async () => {
    const { success, message } = await createSubscription(newSubscription);
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
    }
    setNewSubscription({
      name: "",
      price: "",
      durationInDays: "",
      options: {
        autoSpray: false,
        heatCalculator: false,
        optionA: false,
        optionB: false,
      },
    });
  };

  const handleCheckboxChange = (option) => {
    setNewSubscription((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        [option]: !prev.options[option],
      },
    }));
  };

  return (
    <Box>
      <NavbarSub />
      <Flex>
       
        <Box 
          w={{ base: "70px", md: "250px" }} 
          position="sticky"
          top="0"
          h="calc(100vh - 60px)" 
          borderRight="1px" 
          borderColor="gray.200"
        >
          <Sidebar />
        </Box>
        
        
        <Box flex="1" p={{ base: 4, md: 8 }} maxW={{ md: "700px" }} mx="auto">
          <VStack spacing={8}>
            <Heading as="h1" size="2xl" textAlign="center" mb={8}>
              Create a New Subscription
            </Heading>
            <Box w="full" bg={useColorModeValue("white", "gray.700")} p={6} rounded="lg" shadow="md">
              <VStack spacing={4}>
                <Input
                  placeholder="Subscription Name"
                  value={newSubscription.name}
                  onChange={(e) => setNewSubscription({ ...newSubscription, name: e.target.value })}
                />
                <Input
                  placeholder="Price"
                  type="number"
                  value={newSubscription.price}
                  onChange={(e) => setNewSubscription({ ...newSubscription, price: Number(e.target.value) })}
                />
                <Input
                  placeholder="Duration in Days"
                  type="number"
                  value={newSubscription.durationInDays}
                  onChange={(e) =>
                    setNewSubscription({ ...newSubscription, durationInDays: Number(e.target.value) })
                  }
                />

                <HStack gap={4} wrap="wrap" justify="center">
                  {["autoSpray", "heatCalculator", "optionA", "optionB"].map((option) => (
                    <CheckboxCard.Root
                      key={option}
                      maxW="180px"
                      isChecked={newSubscription.options[option]}
                      onCheckedChange={() => handleCheckboxChange(option)}
                      cursor="pointer"
                    >
                      <CheckboxCard.HiddenInput />
                      <CheckboxCard.Control>
                        <CheckboxCard.Label textTransform="capitalize">
                          {option}
                        </CheckboxCard.Label>
                        <CheckboxCard.Indicator />
                      </CheckboxCard.Control>
                    </CheckboxCard.Root>
                  ))}
                </HStack>
                <Button colorScheme="teal" size="lg" onClick={handleAddSubscription} w="full">
                  Create Subscription
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default CreateSub;