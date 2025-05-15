import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  Flex,
  Badge,
  Stack
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cart";
import { useUserStore } from "../store/user";
import { useSubscriptionStore } from "../store/Subscription";
import { toaster } from "@/components/ui/toaster";
import { Collapsible } from "@chakra-ui/react";
import NavbarClient from "@/items/NavbarClient";

const SubscriptionBox = ({ subscription, isSelected, onSelect }) => {
  return (
    
    <Box 
      borderWidth="1px" 
      borderRadius="md" 
      w="100%"
      borderColor={isSelected ? "green.500" : "gray.200"}
      boxShadow={isSelected ? "md" : "none"}
    >

      <Collapsible.Root>
        <Collapsible.Trigger 
          as={Button}
          w="100%" 
          justifyContent="space-between"
          py={4}
          colorScheme={isSelected ? "green" : "gray"}
          variant={isSelected ? "solid" : "outline"}
          onClick={() => onSelect(subscription._id)}
        >
          <Text>{subscription.name}</Text>
          <Text>${subscription.price}</Text>
        </Collapsible.Trigger>
        
        <Collapsible.Content>
          <Box p={4} borderTop="1px" borderColor="gray.200">
            <Text fontWeight="medium" mb={2}>
              Duration: {subscription.durationInDays} days
            </Text>
            
            <Text fontWeight="medium" mb={2}>Features:</Text>
            <Stack spacing={2}>
              {subscription.options.autoSpray && (
                <Flex alignItems="center">
                  <Badge colorScheme="green" mr={2}>✓</Badge>
                  <Text>Auto Spray</Text>
                </Flex>
              )}
              {subscription.options.heatCalculator && (
                <Flex alignItems="center">
                  <Badge colorScheme="green" mr={2}>✓</Badge>
                  <Text>Heat Calculator</Text>
                </Flex>
              )}
              {subscription.options.optionA && (
                <Flex alignItems="center">
                  <Badge colorScheme="green" mr={2}>✓</Badge>
                  <Text>Option A</Text>
                </Flex>
              )}
              {subscription.options.optionB && (
                <Flex alignItems="center">
                  <Badge colorScheme="green" mr={2}>✓</Badge>
                  <Text>Option B</Text>
                </Flex>
              )}
              {!subscription.options.autoSpray && 
               !subscription.options.heatCalculator && 
               !subscription.options.optionA && 
               !subscription.options.optionB && (
                <Text color="gray.500">No special features</Text>
              )}
            </Stack>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, clearCart } = useCartStore();
  const { loggedInUser, loadUserFromToken } = useUserStore();
  const { subscriptions, fetchSubscriptions } = useSubscriptionStore();
  
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);
  
  useEffect(() => {
    if (!loggedInUser) {
      navigate("/users/login");
      return;
    }
    
    console.log("Logged in user:", loggedInUser);
    
    fetchSubscriptions();
    fetchCart(loggedInUser._id);
  }, [loggedInUser, fetchSubscriptions, fetchCart, navigate]);

  const handleSelect = (id) => {
    setSelectedSubscriptionId(id);
  };

  const handlePay = async () => {
    if (!selectedSubscriptionId) {
      toaster.create({
        title: "Please select a subscription",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    for (const item of cart) {
      await fetch(`/api/products/purchase/${item.productId._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loggedInUser._id,
          subscriptionId: selectedSubscriptionId,
          quantity: item.quantity,
        }),
      });
    }

    await clearCart(loggedInUser._id);
    toaster.create({
      title: "Purchase successful!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/");
  };

  return (
    <>
    <NavbarClient/>
    <Box maxW="600px" mx="auto" mt={8} p={6} boxShadow="md" borderRadius="md">
      
      <Heading mb={6} textAlign="center">Select Subscription</Heading>
      <VStack spacing={4} align="stretch">
        {subscriptions.map((sub) => (
          <SubscriptionBox 
            key={sub._id}
            subscription={sub}
            isSelected={selectedSubscriptionId === sub._id}
            onSelect={handleSelect}
          />
        ))}
        
        <Button
          colorScheme="green"
          onClick={handlePay}
          isDisabled={cart.length === 0}
          mt={4}
        >
          Pay and Purchase
        </Button>
      </VStack>
    </Box>
    </>
  );
};

export default Checkout;