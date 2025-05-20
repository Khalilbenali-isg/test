import React from 'react';
import { 
  Box, 
  Center, 
  Grid, 
  GridItem, 
  Heading, 
  Image, 
  Text, 
  VStack
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import NavbarClient from "@/items/NavbarClient";
import { RevealWrapper } from  'next-reveal'

//import {forest,roses,plants} from '../../../uploads/products/forest.jpg'


const crosswordImages = [
  '/plants image.jpg',
  '/forest.jpg', 
  'rose field.webp',
];

const quizImages = [
  '/quiz1.jpg',
  '/quiz 2.jpg',
  '/quiz3.webp',
];


const crosswordBackgroundImage = '/crossword.jpg';
const quizBackgroundImage = '/quiz bg1.jpg'; 

const GamePage = () => {
  const navigate = useNavigate();
  
  const handleGameSelection = (game, level) => {
   
    navigate(`/${game}/level-${level}`);
  };
  
  return (
    <Box p={8} maxW="1200px" mx="auto">
        <NavbarClient />
     
      <RevealWrapper origin='left' delay={100} duration={2000} distance='200px' reset={true}>
      <Box 
        position="relative" 
        mb={16}
        borderRadius="xl"
        overflow="hidden"
        boxShadow="xl"
      >
        
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex="0"
        >
          <Image
            src={crosswordBackgroundImage}
            alt="Crossword Background"
            w="100%"
            h="100%"
            objectFit="cover"
            filter="blur(6px) brightness(0.7)"
            opacity="0.6"
            fallback={<Box bg="gray.100" h="100%" w="100%" />}
          />
        </Box>
        
       
        <Box 
          position="relative" 
          zIndex="1"
          p={8}
        >
          <VStack spacing={8}>
            <Heading as="h1" size="2xl" textAlign="center" mb={6} >
              Crossword Game
            </Heading>
            
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8} width="100%">
              {[1, 2, 3].map((level) => (
                <GridItem key={`crossword-${level}`}>
                  <Box
                    position="relative"
                    overflow="hidden"
                    borderRadius="lg"
                    cursor="pointer"
                    onClick={() => handleGameSelection("crossword", level)}
                    _hover={{
                      "& > img": {
                        filter: "blur(3px)",
                        transform: "scale(1.05)",
                      },
                      "& .level-text": {
                        fontWeight: "bold",
                        fontSize: "2xl",
                      }
                    }}
                    transition="all 0.3s ease"
                    h="250px"
                    boxShadow="lg"
                  >
                    <Image
                      src={crosswordImages[level-1]} 
                      alt={`Crossword Level ${level}`}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      transition="all 0.3s ease"
                      fallback={<Box bg="gray.200" h="100%" w="100%" />}
                    />
                    <Center
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      bg="blackAlpha.600"
                      color="white"
                    >
                      <Text
                        className="level-text"
                        fontSize="xl"
                        fontWeight="semibold"
                        transition="all 0.3s ease"
                      >
                        Level {level}
                      </Text>
                    </Center>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </VStack>
        </Box>
      </Box>
      </RevealWrapper>
      
      
      <RevealWrapper origin='right' delay={100} duration={2000} distance='300px' reset={true}>
      <Box 
        position="relative" 
        borderRadius="xl"
        overflow="hidden"
        boxShadow="xl"
      >
        
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex="0"
        >
          <Image
            src={quizBackgroundImage}
            alt="Quiz Background"
            w="100%"
            h="100%"
            objectFit="cover"
            filter="blur(5px) brightness(0.7)"
            opacity="0.4"
            fallback={<Box bg="gray.100" h="100%" w="100%" />}
          />
        </Box>
        
       
        <Box 
          position="relative" 
          zIndex="1"
          p={8}
        >
          <VStack spacing={8}>
            <Heading as="h1" size="2xl" textAlign="center" mb={6} >
              Quiz Game
            </Heading>
            
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8} width="100%">
              {[1, 2, 3].map((level) => (
                <GridItem key={`quiz-${level}`}>
                  <Box
                    position="relative"
                    overflow="hidden"
                    borderRadius="lg"
                    cursor="pointer"
                    onClick={() => handleGameSelection("quiz", level)}
                    _hover={{
                      "& > img": {
                        filter: "blur(3px)",
                        transform: "scale(1.05)",
                      },
                      "& .level-text": {
                        fontWeight: "bold",
                        fontSize: "2xl",
                      }
                    }}
                    transition="all 0.3s ease"
                    h="250px"
                    boxShadow="lg"
                  >
                    <Image
                      src={quizImages[level-1]}
                      alt={`Quiz Level ${level}`}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      transition="all 0.3s ease"
                      fallback={<Box bg="gray.200" h="100%" w="100%" />}
                    />
                    <Center
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      bg="blackAlpha.600"
                      color="white"
                    >
                      <Text
                        className="level-text"
                        fontSize="xl"
                        fontWeight="semibold"
                        transition="all 0.3s ease"
                      >
                        Level {level}
                      </Text>
                    </Center>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </VStack>
        </Box>
      </Box>
      </RevealWrapper>
    </Box>
  );
};

export default GamePage;