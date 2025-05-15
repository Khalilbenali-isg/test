import { Box, Container, Flex, Image, Text, Button, VStack, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useProductStore } from "@/store/product";
import { useUserStore } from "@/store/user";
import useFeedbackStore from "@/store/feedback";
import Navbar from "@/items/Navbar";
import ProductCardClt from "@/items/ProductCardClt";
import NavbarClient from "@/items/NavbarClient";
import FeedbackCard from "@/items/FeedbackCard";
import { useNavigate } from "react-router-dom";
import FeedbackPopoverForm from "@/items/FeedbackPopoverForm";
import { Toaster, toaster } from "@/components/ui/toaster"


const HomePageClt = () => {
  const { fetchProducts, products } = useProductStore();
  const { loggedInUser } = useUserStore();
  const { feedbacks, fetchFeedbacks, createFeedback } = useFeedbackStore();
  const [newFeedback, setNewFeedback] = useState("");
  const navigate = useNavigate();
  const [randomProducts, setRandomProducts] = useState([]);
  const [randomFeedbacks, setRandomFeedbacks] = useState([]);
  

  useEffect(() => {
    fetchProducts();
    fetchFeedbacks();
  }, [fetchProducts, fetchFeedbacks]);
  
  useEffect(() => {
    if (products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setRandomProducts(shuffled.slice(0, 3));
    }
  }, [products]);
  
  useEffect(() => {
    const verified = feedbacks.filter((fb) => fb.Verified);
    if (verified.length > 0) {
      const shuffled = [...verified].sort(() => 0.5 - Math.random());
      setRandomFeedbacks(shuffled.slice(0, 3));
    }
  }, [feedbacks]);
  
  
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!newFeedback.trim()) {
      toaster.create({
        title: "Please enter a feedback message",
        type: "warning",
      });
      return;
    }

    const success = await createFeedback(loggedInUser?._id, newFeedback);
    
    if (success) {
      toaster.create({
        title: "Your feedback has been submitted",
        type: "success",
      });
      setNewFeedback("");
    } else {
      toaster.create({
        title: "Failed to submit feedback",
        type: "error",
      });
    }
  };

  
  

  return (
    <>
      <NavbarClient />
      <Box as="section" id="home" py={20} >
        <Container maxW="container.xl">
          <Flex align="center" justify="space-between" flexDir={{ base: "column", md: "row" }}>
            
            <Image src="https://cheekyplantco.com.au/cdn/shop/files/cheekyplantco_sq_primarylogo_cloudonfern_1200x1200.png?v=1695033305" alt="Company" boxSize="400px" borderRadius="xl" />
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
      {randomProducts.map((product) => (
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
      
      <Box as="section" id="feedback" py={20} >
        <Container maxW="container.xl"  >
          <Text fontSize="4xl" fontWeight="bold" mb={10} textAlign="center">
            What Our Clients Say
          </Text>
          
         
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mb={16} gap={10}>
          {randomFeedbacks.length > 0 ? (
              randomFeedbacks.map((feedback) => (
                <FeedbackCard key={feedback._id} feedback={feedback} />
              ))
            ) : (
              <Box gridColumn="span 3" textAlign="center">
                <Text color="gray.500">No feedback available yet. Be the first to leave a review!</Text>
              </Box>
            )}
          </SimpleGrid>
          <Flex align="center" justify="center" flexDir={{ base: "column", md: "row" }}> 
            <FeedbackPopoverForm  />
           </Flex>
          

          
          
        </Container>
      </Box>

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

      <Box as="footer" id="footer" py={10}>
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