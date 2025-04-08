import { Container, VStack, Text, SimpleGrid } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useSubscriptionStore } from "@/store/Subscription";
import NavbarSub from "@/items/NavbarSub";
import SubscriptionCard from "@/items/SubscriptionCard";
import { useUserStore } from "@/store/user";
import { useNavigate } from "react-router-dom";

const SubscriptionsPage = () => {
  const { loggedInUser } = useUserStore();
  const navigate = useNavigate();
  const { fetchSubscriptions, subscriptions } = useSubscriptionStore();

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/users/login");
    }
  }, [loggedInUser, navigate]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return (
    <Container maxW="container.xl" py={12}>
      <NavbarSub />
      <VStack spacing={8}>
        <Text
          fontSize="5xl"
          fontWeight="bold"
          textAlign="center"
          bgGradient={"linear(to-l, #7928CA,#FF0080)"}
        >
          Subscriptions
        </Text>
        {subscriptions.length === 0 && (
          <Text
            fontSize="3xl"
            fontWeight="bold"
            textAlign="center"
            color="gray.500"
          >
            No subscriptions available
          </Text>
        )}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} gap={4} w="full">
          {subscriptions.map((sub) => (
            <SubscriptionCard key={sub._id} subscription={sub} />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default SubscriptionsPage;
