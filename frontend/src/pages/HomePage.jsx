import { Box, Flex, VStack, Text, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useProductStore } from '@/store/product';
import Navbar from '@/items/Navbar';
import ProductCard from '@/items/ProductCard';
import { useUserStore } from '@/store/user';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/items/Sidebar';

const HomePage = () => {
  const { loggedInUser, loadUserFromToken } = useUserStore();
  const navigate = useNavigate();
  const { fetchProducts, products } = useProductStore();
  
  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);
  
  useEffect(() => {
    if (!loggedInUser) {
      navigate("/users/login");
      return;
    }
  }, [loggedInUser, navigate]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <Box>
      <Navbar />
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
            <Text
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="bold"
              textAlign="center"
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              bgClip="text"
            >
              Current Products
            </Text>
            
            {products.length === 0 && (
              <Text
                fontSize={{ base: "2xl", md: "4xl" }}
                fontWeight="bold"
                textAlign="center"
                bgGradient="linear(to-l, #7928CA, #FF0080)"
                bgClip="text"
              >
                No products available
              </Text>
            )}
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={20} gap={6} w={"full"}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </SimpleGrid>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default HomePage;