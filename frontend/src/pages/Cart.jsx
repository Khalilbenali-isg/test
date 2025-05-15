import React, { useEffect ,useState} from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cart";
import { useUserStore } from "../store/user";
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Image,
  Heading,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";


const Cart = () => {
  const navigate = useNavigate();
  
  const { loggedInUser, loadUserFromToken } = useUserStore();
  const { cart, fetchCart, removeFromCart, clearCart } = useCartStore();
  
  const [isLoading, setIsLoading] = useState(true); 
      
  useEffect(() => {
    const loadUser = async () => {
      await loadUserFromToken();
      setIsLoading(false);
    };
    loadUser();
  }, [loadUserFromToken]);
  
  useEffect(() => {
    if (isLoading) return;
    
    if (!loggedInUser) {
      navigate("/users/login");
    } else if (loggedInUser._id) {
      console.log("Logged in user:", loggedInUser);
      console.log("User ID:", loggedInUser._id);
      fetchCart(loggedInUser._id);
    }
  }, [loggedInUser, isLoading, navigate, fetchCart]);

 /* useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  
  useEffect(() => {
    if (!loggedInUser) {
      navigate("/users/login");
    } else {
      const userId = loggedInUser._id;
      if (userId) fetchCart(userId);
    }
  }, [loggedInUser, navigate, fetchCart]);*/

  const handleRemove = async (productId) => {
    if (loggedInUser?._id) {
      await removeFromCart(loggedInUser._id, productId);
      toaster.create({
        title: "Item removed",
        description: "The product has been removed from your cart.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleClearCart = async () => {
    if (loggedInUser?._id) {
      await clearCart(loggedInUser._id);
      toaster.create({
        title: "Cart cleared",
        description: "Your cart is now empty.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const getTotalPrice = () => {
    return cart
      .reduce((total, item) => total + (item.productId?.price || 0) * item.quantity, 0)
      .toFixed(2);
  };

  if (!loggedInUser) return null;

  return (
    <Box maxW="800px" mx="auto" p={5} boxShadow="lg" borderRadius="lg">
      <Heading size="lg" mb={4} textAlign="center">
         My Cart
      </Heading>
      {cart.length === 0 ? (
        <VStack spacing={4}>
          <Text fontSize="lg" textAlign="center">
            Your cart is empty.
          </Text>
          <Button colorScheme="blue" onClick={() => navigate("/store")}>
            Browse Products
          </Button>
        </VStack>
      ) : (
        <>
          <VStack spacing={4} align="stretch">
            {cart.map((item) => (
              <HStack
                key={item._id}
                p={3}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                _hover={{ transform: "scale(1.02)", transition: "0.2s" }}
              >
                <Image
                  src={`http://localhost:5000/${item.productId?.Image}`}
                  alt={item.productId?.name}
                  boxSize="80px"
                  borderRadius="md"
                  objectFit="cover"
                />
                <Stack flex="1">
                  <Text fontSize="md" fontWeight="bold">
                    {item.productId?.name}
                  </Text>
                  <Text>Price: ${item.productId?.price}</Text>
                  <Text>Quantity: {item.quantity}</Text>
                </Stack>
                <Button
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleRemove(item.productId?._id)}
                  aria-label="Remove item"
                >
                  
                </Button>
              </HStack>
            ))}
          </VStack>

          <Box textAlign="center" mt={6}>
            <Text fontSize="lg" fontWeight="bold">
              Total: ${getTotalPrice()}
            </Text>
            <HStack mt={4} spacing={4} justify="center">
              <Button colorScheme="red" variant="outline" onClick={handleClearCart}>
                Clear Cart
              </Button>
              <Button colorScheme="green" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </Button>
              <Button colorScheme="green" onClick={() => navigate("/store")}>
                Continue Shopping
              </Button>
            </HStack>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Cart;