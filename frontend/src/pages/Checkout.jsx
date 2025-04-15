import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Stack,
  
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cart";
import { useUserStore } from "../store/user";
import { toaster } from "@/components/ui/toaster";

const Checkout = () => {
  
  const navigate = useNavigate();
  const { cart, fetchCart, clearCart } = useCartStore();
  const { loggedInUser } = useUserStore();

  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/users/login");
      return;
    }

    const fetchSubscriptions = async () => {
      const res = await fetch("/api/subscriptions");
      const data = await res.json();
      if (data.success) {
        setSubscriptions(data.data);
      }
    };

    fetchSubscriptions();
    fetchCart(loggedInUser._id);
  }, [loggedInUser]);

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
    <Box maxW="600px" mx="auto" mt={8} p={6} boxShadow="md" borderRadius="md">
      <Heading mb={6} textAlign="center">Select Subscription</Heading>
      <VStack spacing={4}>
        {subscriptions.map((sub) => (
          <Button
            key={sub._id}
            onClick={() => handleSelect(sub._id)}
            colorScheme={selectedSubscriptionId === sub._id ? "blue" : "gray"}
            variant={selectedSubscriptionId === sub._id ? "solid" : "outline"}
            w="100%"
            justifyContent="space-between"
          >
            <Text>{sub.name}</Text>
            <Text>${sub.price}</Text>
          </Button>
        ))}
        <Button
          colorScheme="green"
          onClick={handlePay}
          isDisabled={cart.length === 0}
        >
          Pay and Purchase
        </Button>
      </VStack>
    </Box>
  );
};

export default Checkout;
