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
import { RevealWrapper } from  'next-reveal'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000, 
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    fade: false, 
    cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)' 
  };

  
  const slides = [
    {
      image: "homeimage1.webp",
      title: "Premium Quality Products",
      description: "Grow Green with Tech – Intelligent Plant Care at Your Fingertips.",
      buttonText: "Shop Now",
      buttonColor: "teal",
      buttonAction: () => navigate("/store")
    },
    {
      image: "homeimage2.webp",
      title: "Summer Collection 2023",
      description: "Smart Plants, Smarter Living – Auto Spray & Heat Control for Effortless Growth!",
      buttonText: "View Collection",
      buttonColor: "blue",
      buttonAction: () => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })
    },
    {
      image: "DALL·E 2025-05-19 11.52.34 - A visually stunning homepage slider image for an e-commerce website that sells plants and roses. The image shows a vibrant plant nursery setting with .webp",
      title: "Sign up today",
      description: "sign un and enjoy all the site features",
      buttonText: "Join Now",
      buttonColor: "purple",
      buttonAction: () => navigate("/users/create")
    }
  ];

  return (
    <>
      <NavbarClient />
      <RevealWrapper origin='bottom' delay={0} duration={2000} distance='300px' reset={false}>
      <Box as="section" id="home" position="relative" h="80vh" overflow="hidden">
        <Slider {...sliderSettings}>
          {slides.map((slide, index) => (
            <Box key={index} h="80vh" position="relative">
              <Image 
                src={slide.image} 
                alt={`Slide ${index + 1}`} 
                w="100%" 
                h="100%" 
                objectFit="cover"
                borderRadius={"xl"}
                boxShadow={"xl"}
                opacity={0.7}
              />
              <Container 
                maxW="container.xl" 
                position="absolute" 
                top="50%" 
                left="50%" 
                transform="translate(-50%, -50%)"
                textAlign="center"
                zIndex="1"
              >
                <Text 
                  fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }} 
                  fontWeight="bold" 
                  mb={4}
                  textShadow="2px 2px 4px rgba(0,0,0,0.5)"
                >
                  {slide.title}
                </Text>
                <Text 
                  fontSize={{ base: "lg", md: "xl", lg: "2xl" }} 
                  mb={8}
                  maxW="2xl"
                  mx="auto"
                  textShadow="1px 1px 2px rgba(0,0,0,0.5)"
                >
                  {slide.description}
                </Text>
                <Button 
                  colorScheme={slide.buttonColor} 
                  size="lg" 
                  onClick={slide.buttonAction}
                  px={8}
                  fontSize="lg"
                  _hover={{ transform: 'scale(1.05)' }}
                  transition="all 0.2s"
                >
                  {slide.buttonText}
                </Button>
              </Container>
            </Box>
          ))}
        </Slider>
        
       
        <style jsx global>{`
          .slick-prev, .slick-next {
            width: 40px;
            height: 40px;
            z-index: 10;
          }
          .slick-prev:before, .slick-next:before {
            font-size: 40px;
            opacity: 0.7;
          }
          .slick-prev {
            left: 25px;
          }
          .slick-next {
            right: 25px;
          }
          .slick-dots {
            bottom: 20px;
          }
          .slick-dots li button:before {
            font-size: 12px;
            color: white;
          }
        `}</style>
      </Box>
      </RevealWrapper>
     <Box as="section" id="products" py={20} >
  <Container maxW="container.xl">
  <RevealWrapper origin='bottom' delay={0} duration={1000} distance='50px' reset={true} > 
    <Text fontSize="4xl" fontWeight="bold" mb={10} textAlign="center">
      Our Top Products
    </Text>
    </RevealWrapper>
    <RevealWrapper origin='bottom' delay={0} duration={2000} distance='50px' reset={true} > 
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} gap={10}>
      {randomProducts.map((product) => (
        <ProductCardClt key={product._id} product={product} />
      ))}
    </SimpleGrid>
    </RevealWrapper>
  </Container>
</Box>
      
      <Flex align="center" justify="center" flexDir={{ base: "column", md: "row" }}>
        <Button colorScheme="teal" size="lg" onClick={() => navigate("/store")} mt={6}>
          Discover Products
        </Button>
      </Flex>
      
      <Box as="section" id="feedback" py={20} >
        <Container maxW="container.xl"  >
        <RevealWrapper origin='left' delay={0} duration={1000} distance='50px' reset={true} > 
          <Text fontSize="4xl" fontWeight="bold" mb={10} textAlign="center">
            What Our Clients Say
          </Text>
          </RevealWrapper>
          <RevealWrapper origin='right' delay={0} duration={2000} distance='50px' reset={true} > 
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
          </RevealWrapper>
          <Flex align="center" justify="center" flexDir={{ base: "column", md: "row" }}> 
            <FeedbackPopoverForm  />
           </Flex>
          
        </Container>
      </Box>

      <Box as="section" id="about" py={20} >
      <RevealWrapper opacity={0}  duration={800} delay={0} easing="ease-in-out" reset={true}>
        <Container maxW="container.lg" textAlign="center">
          <Text fontSize="4xl" fontWeight="bold" mb={6}>
            About Us
          </Text>
          <Text fontSize="lg">
          We are a passionate Tunisian team on a mission to make plant care effortless for everyone. By combining technology and nature, we create smart automation systems that help your plants thrive—whether you're a beginner or an expert. With our solutions, you can enjoy the beauty and benefits of plants without the stress of daily maintenance.

Grow smarter, live greener
          </Text>
        </Container>
        </RevealWrapper>
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