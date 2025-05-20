import { Box, Flex, VStack, Text, SimpleGrid } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useSubscriptionStore } from "@/store/Subscription";
import NavbarSub from "@/items/NavbarSub";
import SubscriptionCard from "@/items/SubscriptionCard";
import { useUserStore } from "@/store/user";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/items/Sidebar";

const SubscriptionsPage = () => {
  const { loggedInUser, loadUserFromToken } = useUserStore();
  const navigate = useNavigate();
  const { fetchSubscriptions, subscriptions } = useSubscriptionStore();

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/users/login");
      return;
    } else {
      const userId = loggedInUser.id;
    }
    console.log("Logged in user:", loggedInUser);
    console.log(loggedInUser._id);
  });

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

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
        
       
        <Box flex="1" p={{ base: 4, md: 8 }}>
          <VStack spacing={8} align="stretch">
           
            
            {subscriptions.length === 0 && (
              <Text
                fontSize={{ base: "2xl", md: "4xl" }}
                fontWeight="bold"
                textAlign="center"
                bgGradient="linear(to-l, #7928CA, #FF0080)"
                bgClip="text"
              >
                No subscriptions available
              </Text>
            )}
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={20} gap={6} w={"full"}>
              {subscriptions.map((sub) => (
                <SubscriptionCard key={sub._id} subscription={sub} />
              ))}
            </SimpleGrid>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default SubscriptionsPage;