import { useColorModeValue } from '@/components/ui/color-mode';
import { Box, Image, Heading, Text, Button } from '@chakra-ui/react';
import React from 'react';
import { useProductStore } from '@/store/product';
import { toaster } from '@/components/ui/toaster';

const ProductCardClt = ({ product }) => {
    

    const { purchaseProduct } = useProductStore(); 

    const handlePurchase = async () => {
        const response = await purchaseProduct(product._id); 
        if (response.success) {
            toaster.create({
                title: "Success",
                description: "Product purchased!",
                type: "success",
                isClosable: true,
            });
        } else {
            toaster.create({
                title: "Error",
                description: response.message,
                type: "error",
                isClosable: true,
            });
        }
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
                <Text fontWeight="bold" fontSize="xl"  mb={2}>{product.name}</Text>
                <Text>Price: ${product.price}</Text>
                <Text>Stock: {product.stock}</Text>
                <Button 
                    
                    mt={4} 
                    onClick={handlePurchase} 
                    isDisabled={product.stock <= 0}
                >
                    {product.stock > 0 ? "Purchase" : "Out of Stock"}
                </Button>
               
            </Box>
        </Box>
    );
};

export default ProductCardClt;
