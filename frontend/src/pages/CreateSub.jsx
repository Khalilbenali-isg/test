import { useColorMode, useColorModeValue } from '@/components/ui/color-mode';
import { useSubscriptionStore } from '@/store/Subscription'; // <-- update store path if needed
import { Container, VStack, Heading, Box, Input, Button, Image, HStack } from '@chakra-ui/react';
import { toaster } from "@/components/ui/toaster";
import React from 'react';
import { CheckboxCard } from "@chakra-ui/react";
import NavbarSub from '@/items/NavbarSub'

const CreateSubscriptionPage = () => {
  const [newSubscription, setNewSubscription] = React.useState({
    name: "",
    price: "",
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
    <Container maxW="container.sm">
        <NavbarSub/>
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
            <HStack gap={4} wrap="wrap">
              {["autoSpray", "heatCalculator", "optionA", "optionB"].map((option) => (
                <CheckboxCard.Root
                  key={option}
                  maxW="180px"
                  isChecked={newSubscription.options[option]}
                  onClick={() => handleCheckboxChange(option)}
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
        <Image rounded="md" src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
      </VStack>
    </Container>
  );
};

export default CreateSubscriptionPage;
