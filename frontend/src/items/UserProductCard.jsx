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
  const { product, quantity, purchasedAt, expiresAt, subscription } = userProduct;

  const purchaseDate = dayjs(purchasedAt).format('DD MMM YYYY - HH:mm');
  const timeLeft = expiresAt ? dayjs().to(dayjs(expiresAt)) : '—';

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
      {product?.Image && (
        <Image
          src={product.Image}
          alt={product.title}
          objectFit="cover"
          w="100%"
          h="200px"
        />
      )}

      <Box p={4}>
        <VStack align="start" spacing={2}>
          <Text fontSize="xl" fontWeight="bold">{product?.title}</Text>
          <Text fontSize="md" color="gray.600">€ {product?.price}</Text>
          <Text fontSize="sm" color="gray.500">Quantity: {quantity}</Text>

         

          <HStack w="full" justifyContent="space-between">
            <Badge colorScheme="blue">Bought: {purchaseDate}</Badge>
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
