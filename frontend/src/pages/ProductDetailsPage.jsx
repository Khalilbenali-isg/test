import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../store/product";
import { useCartStore } from "../store/cart";
import { useUserStore } from "../store/user";
import {
  Box,
  Container,
  Image,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Spinner,
  NumberInput as ChakraNumberInput,
  NumberInputRoot,
  NumberInputControl,
  NumberInputInput,
} from "@chakra-ui/react";
import NavbarClient from "@/items/NavbarClient";
import { toaster } from "@/components/ui/toaster";

const ProductDetailsPage = () => {
  
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { fetchProductById } = useProductStore();
  const { cart ,addToCart } = useCartStore();
  const { loggedInUser } = useUserStore();
  console.log("loggedInUser:", loggedInUser);
  console.log("userId being sent:", loggedInUser?.id);


  useEffect(() => {
    console.log("Updated cart after adding:", cart);
}, [cart]); 


  useEffect(() => {
    const getProductDetails = async () => {
      setLoading(true);
      try {
        const productData = await fetchProductById(productId);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product details:", error);
        toaster.create({
          title: "Error",
          description: "Failed to load product details",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      getProductDetails();
    }
  }, [productId, fetchProductById]);

  const handleAddToCart = async () => {
    if (!loggedInUser) {
      navigate("/users/login");
      toaster.create({
        title: "Please log in",
        description: "You must be logged in to add items to your cart",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    if (product.stock <= 0) {
      toaster.create({
        title: "Out of stock",
        description: "This product is currently out of stock",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    try {
      
      console.log("Adding to cart with quantity:", quantity);
      
      const response = await addToCart(loggedInUser._id, product._id, quantity);
      if (response.success) {
        toaster.create({
          title: "Added to cart",
          description: `${product.name} has been added to your cart`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        navigate("/cart");
      } else {
        toaster.create({
          title: "Error",
          description: response.message || "Failed to add to cart",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toaster.create({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  if (loading) {
    return (
      <>
        <NavbarClient />
        <Container maxW="container.lg" py={10} centerContent>
          <Spinner size="xl" />
          <Text mt={4}>Loading product details...</Text>
        </Container>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <NavbarClient />
        <Container maxW="container.lg" py={10} centerContent>
          <Heading>Product Not Found</Heading>
          <Button mt={4} colorScheme="blue" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavbarClient />
      <Container maxW="container.lg" py={10}>
        <Box p={6} rounded="lg" shadow="lg">
          <Box display={{ md: "flex" }} alignItems="center">
            <Box flexShrink={0} width={{ base: "100%", md: "40%" }} mb={{ base: 6, md: 0 }}>
              <Image
                borderRadius="lg"
                src={product.Image}
                alt={product.name}
                objectFit="cover"
                width="100%"
                height="auto"
                maxH="400px"
              />
            </Box>

            <VStack alignItems="flex-start" ml={{ md: 8 }} spacing={4} width={{ base: "100%", md: "60%" }}>
              <Heading size="xl">{product.name}</Heading>

              <HStack>
                <Badge colorScheme={product.stock > 0 ? "green" : "red"}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>

                {product.stock > 0 && (
                  <Text fontSize="sm">
                    {product.stock} {product.stock === 1 ? "item" : "items"} left
                  </Text>
                )}
              </HStack>

              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                ${product.price}
              </Text>

              <Text fontSize="md">{product.description || "No description available for this product."}</Text>

              {product.stock > 0 && (
                <HStack>
                  <Text>Quantity:</Text>
                  <HStack>
  <Text>Quantity:</Text>
  <Button
    size="sm"
    onClick={() => setQuantity(Math.max(1, quantity - 1))}
    isDisabled={quantity <= 1}
  >
    -
  </Button>
  <Box px={2}>{quantity}</Box>
  <Button
    size="sm"
    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
    isDisabled={quantity >= product.stock}
  >
    +
  </Button>
</HStack>
                </HStack>
              )}

              <HStack spacing={4} mt={4} width="100%">
                <Button
                  colorScheme="blue"
                  size="lg"
                  width={{ base: "full", md: "auto" }}
                  onClick={handleAddToCart}
                  isDisabled={product.stock <= 0}
                >
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  width={{ base: "full", md: "auto" }}
                  onClick={() => navigate("/store")}
                >
                  Back to Products
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ProductDetailsPage;
