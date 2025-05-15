import React, { useEffect , useState} from 'react';
import { useUserStore } from '../store/user';
import { useUserProductStore } from '../store/userProducts';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, SimpleGrid, Spinner, Text , Button } from '@chakra-ui/react';
import UserProductCard from '../items/UserProductCard';
import NavBarClient from '../items/NavbarClient';

const UserProductsPage = () => {
  const { loggedInUser,loadUserFromToken } = useUserStore();
  const navigate = useNavigate();

  const { userProducts, fetchUserProducts, loading, error } = useUserProductStore();

  /* useEffect(() => {
      loadUserFromToken();
    }, [loadUserFromToken]);
  
    
   
      
    
  useEffect(() => {
    if (!loggedInUser) {
      navigate('/users/login');
    } else {
      fetchUserProducts(loggedInUser._id);
      const userId = loggedInUser.id;
    }
  }, [loggedInUser]);*/

   const [isLoading, setIsLoading] = useState(true); 
  
    useEffect(() => {
      const loadUser = async () => {
        await loadUserFromToken();
        setIsLoading(false); 
      };
      loadUser();
    }, [loadUserFromToken]);
  
    useEffect(() => {
      
      if (!isLoading && !loggedInUser) {
        navigate("/users/login");
        return;
      } else if (loggedInUser) {
        fetchUserProducts(loggedInUser._id);
      const userId = loggedInUser.id;
      }
      
    }, [loggedInUser, isLoading]);
  
  
  if (error) return <Text color="red.500" mt={10}>{error}</Text>;

  return (
    <Box p={6}> 
        <NavBarClient />
      <Heading mb={6}>My Purchased Products</Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={6} gap={6}>
  {userProducts.length > 0 ? (
    userProducts.map(product => (
      <UserProductCard key={product._id} userProduct={product} />
    ))
  ) : (
    <Box
      mt={10}
      textAlign="center"
      w="full"
      p={10}
      borderRadius="xl"
      
      boxShadow="lg"
      animation="fadeIn 0.5s ease-in-out"
      gridColumn="1 / -1"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4} >
        You haven’t purchased any products yet.
      </Text>
      <Text fontSize="md" color="gray.500" mb={6}>
        Start exploring our amazing collection!
      </Text>
      <Button
        colorScheme="teal"
        size="lg"
        onClick={() => navigate('/store')}
      >
        Go to Store
      </Button>
    </Box>
  )}
</SimpleGrid>

    </Box>
  );
};

export default UserProductsPage;
