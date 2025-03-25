import { Container, VStack, Text, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useProductStore } from '@/store/product';
import Navbar from '@/items/Navbar';
import ProductCard from '@/items/ProductCard';
import { useUserStore } from '@/store/user';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { loggedInUser } = useUserStore();
  const navigate = useNavigate();
  const { fetchProducts, products } = useProductStore();
  console.log(loggedInUser)

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/users/login'); // Redirect 
    }
  }, [loggedInUser, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <Container maxW="container.xl" py={12}>
      <Navbar />
      <VStack spacing={8}>
        <Text
          fontSize="5xl"
          fontWeight="bold"
          textAlign="center"
          bgGradient={"linear(to-l, #7928CA,#FF0080)"}
        >
          Current Products
        </Text>
        {products.length === 0 && (
          <Text
            fontSize="5xl"
            fontWeight="bold"
            textAlign="center"
            bgGradient={"linear(to-l, #7928CA,#FF0080)"}
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
    </Container>
  );
};

export default HomePage;