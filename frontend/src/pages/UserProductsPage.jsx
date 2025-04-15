import React, { useEffect } from 'react';
import { useUserStore } from '../store/user';
import { useUserProductStore } from '../store/userProducts';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import UserProductCard from '../items/UserProductCard';
import NavBarClient from '../items/NavbarClient';

const UserProductsPage = () => {
  const { loggedInUser } = useUserStore();
  const navigate = useNavigate();

  const { userProducts, fetchUserProducts, loading, error } = useUserProductStore();

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/users/login');
    } else {
      fetchUserProducts(loggedInUser._id);
    }
  }, [loggedInUser]);

  if (loading) return <Spinner size="xl" mt={10} />;
  if (error) return <Text color="red.500" mt={10}>{error}</Text>;

  return (
    <Box p={6}> 
        <NavBarClient />
      <Heading mb={6}>My Purchased Products</Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={6} gap={6}>
        {userProducts.map(product => (
          <UserProductCard key={product._id} userProduct={product} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default UserProductsPage;
