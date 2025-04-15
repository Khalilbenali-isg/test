import { Box, Container, Flex, Image, Text, Button, VStack, SimpleGrid, Card, CardBody } from "@chakra-ui/react";
import { useEffect } from "react";
import { useProductStore } from "@/store/product";
import Navbar from "@/items/Navbar";
import ProductCardClt from "@/items/ProductCardClt";
import NavbarClient from "@/items/NavbarClient";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const HomePageClt = () => {
  const { fetchProducts, products } = useProductStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      <NavbarClient />
      <Box as="section" id="home" py={20} >
        <Container maxW="container.xl">
          <Flex align="center" justify="space-between" flexDir={{ base: "column", md: "row" }}>
            <Image src="https://api.deepai.org/job-view-file/e4691a89-8a68-43b8-8eb3-b0531542a583/outputs/output.jpg" alt="Company" boxSize="400px" borderRadius="xl" />
            <Box ml={{ md: 10 }} mt={{ base: 6, md: 0 }}>
              <Text fontSize="4xl" fontWeight="bold" mb={4}>
                Welcome to Our Company!
              </Text>
              <Text fontSize="lg" mb={6}>
                We provide top-quality products and services tailored to your needs. Explore our range and see why clients trust us.
              </Text>
              <Button colorScheme="teal" size="lg" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
                Discover Products
              </Button>
            </Box>
          </Flex>
        </Container>
      </Box>

      <Box as="section" id="products" py={20} >
        <Container maxW="container.xl">
          <Text fontSize="4xl" fontWeight="bold" mb={10} textAlign="center">
            Our Top Products
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} gap={10}>
            {products.slice(0, 3).map((product) => (
              <ProductCardClt key={product._id} product={product} />
            ))}
          </SimpleGrid>
          
        </Container>
       
        
      </Box>
      <Flex align="center" justify="center" flexDir={{ base: "column", md: "row" }}>
          <Button colorScheme="teal" size="lg" onClick={() => navigate("/store")} mt={6}>
                  Discover Products
                </Button>
        </Flex>
      <Box as="section" id="about" py={20} >
        <Container maxW="container.lg" textAlign="center">
          <Text fontSize="4xl" fontWeight="bold" mb={6}>
            About Us
          </Text>
          <Text fontSize="lg">
            Our company has been at the forefront of innovation, providing reliable products that meet customer demands. We believe in
            quality, integrity, and long-term partnerships.
          </Text>
        </Container>
      </Box>

      

      <Box as="footer" id="footer" py={10}  >
        <Container maxW="container.xl" textAlign="center">
          <Text fontSize="lg" mb={4}>© {new Date().getFullYear()} Your Company. All rights reserved.</Text>
          <Flex justify="center" gap={6}>
            <Button variant="link" onClick={() => document.getElementById('home').scrollIntoView({ behavior: 'smooth' })} color="teal.200">Home</Button>
            <Button variant="link" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })} color="teal.200">Products</Button>
            <Button variant="link" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })} color="teal.200">About</Button>
            <Button variant="link" onClick={() => document.getElementById('feedback').scrollIntoView({ behavior: 'smooth' })} color="teal.200">Feedback</Button>
          </Flex>
        </Container>
      </Box>
    </>
  );
};

export default HomePageClt;
