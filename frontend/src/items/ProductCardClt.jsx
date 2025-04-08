import { Box, Image, Heading, Text, Button } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCardClt = ({ product }) => {
    const navigate = useNavigate();
    
    const handleViewDetails = () => {
        navigate(`/product/${product._id}`);
    };

    return (
        <Box 
            overflow="hidden" 
            p={6} 
            rounded="lg" 
            shadow="lg" 
            _hover={{ transform: "scale(1.05)" }}
        >
            <Image 
                src={product.Image} 
                alt={product.name} 
                h={48} 
                w="full" 
                objectFit="cover" 
            />
            <Box p={4}>
                <Heading as="h3" size="md" mb={2}>{product.name}</Heading>
                <Text fontWeight="bold" fontSize="xl" mb={2}>${product.price}</Text>
                <Text>Stock: {product.stock}</Text>
                <Button 
                    colorScheme="blue"
                    mt={4} 
                    onClick={handleViewDetails}
                >
                    View Details
                </Button>
            </Box>
        </Box>
    );
};

export default ProductCardClt;