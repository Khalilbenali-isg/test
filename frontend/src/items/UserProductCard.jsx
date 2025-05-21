import React from 'react';
import {
  Box,
  Image,
  Text,
  Badge,
  VStack,
  HStack,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const UserProductCard = ({ userProduct }) => {
  const { product, quantity, purchasedAt, expiresAt, subscription, status } = userProduct;

  const purchaseDate = dayjs(purchasedAt).format('DD MMM YYYY - HH:mm');
  const timeLeft = expiresAt ? dayjs().to(dayjs(expiresAt)) : '—';
  
  const getImageUrl = () => {
    if (!product || !product.Image) return null;
    return `http://localhost:5000/${product.Image}`;
  };
  
  const imageUrl = getImageUrl();
  
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      w="full"
      maxW="350px"
      transition="all 0.3s ease"
      _hover={{
        transform: 'scale(1.03)',
        boxShadow: 'xl',
      }}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={product.name || product.title}
          objectFit="cover"
          w="100%"
          h="200px"
          onError={(e) => {
            console.error("Image failed to load:", e);
            e.target.src = "https://via.placeholder.com/350x200?text=Image+Not+Found";
          }}
        />
      )}

      <Box p={4}>
        <VStack align="start" spacing={2}>
          <Text fontSize="xl" fontWeight="bold">{product?.name || product?.title}</Text>
          <Text fontSize="md" color="gray.600">€ {product?.price}</Text>
          <Text fontSize="sm" color="gray.500">Quantity: {quantity}</Text>

          <HStack w="full" justifyContent="space-between" flexWrap="wrap">
            <HStack>
              <Badge colorScheme="blue">Bought: {purchaseDate}</Badge>
              <Badge colorScheme={status === 'delivered' ? 'green' : 'yellow'}>
                {status === 'delivered' ? 'Delivered' : 'In Delivery'}
              </Badge>
            </HStack>
            
            {subscription ? (
              <Badge colorScheme="green">Expires {timeLeft}</Badge>
            ) : (
              <Badge colorScheme="yellow">No Subscription</Badge>
            )}
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default UserProductCard;