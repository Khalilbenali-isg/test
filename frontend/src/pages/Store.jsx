import React, { useEffect, useState } from 'react';
import { Box, SimpleGrid, Heading, Flex, Button, Field, Input, defineStyle } from '@chakra-ui/react';
import ProductCardClt from '@/items/ProductCardClt';
import NavbarClient from '@/items/NavbarClient';

const floatingStyles = defineStyle({
  pos: "absolute",
  bg: "bg",
  px: "0.5",
  top: "-3",
  insetStart: "2",
  fontWeight: "normal",
  pointerEvents: "none",
  transition: "position",
  _peerPlaceholderShown: {
    color: "fg.muted",
    top: "2.5",
    insetStart: "3",
  },
  _peerFocusVisible: {
    color: "fg",
    top: "-3",
    insetStart: "2",
  },
});

const Store = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data); 
          setLoading(false);
        } else {
          console.error('Failed to fetch products:', data);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  const clearAllFilters = () => {
    setSearch('');
    setPriceFilter('');
    setStockFilter('');
  };

  const filteredProducts = products.filter(product => {
    const productName = product.name || '';
    const matchesSearch = productName.toLowerCase().includes(search.toLowerCase());
    
    const productPrice = product.price || 0;
    const matchesPrice =
      priceFilter === '' ||
      (priceFilter === 'low' && productPrice < 20) ||
      (priceFilter === 'medium' && productPrice >= 20 && productPrice <= 50) ||
      (priceFilter === 'high' && productPrice > 50);
    
    const productStock = product.stock || 0;
    const matchesStock =
      stockFilter === '' ||
      (stockFilter === 'in' && productStock > 0) ||
      (stockFilter === 'out' && productStock <= 0);

    return matchesSearch && matchesPrice && matchesStock;
  });

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box p={6}>
      <NavbarClient />
      
      <Flex mb={6} gap={4} flexWrap="wrap" alignItems="flex-start">
        
        <Flex direction="column" gap={4} flex="1" maxW="800px">
         
          <Field.Root>
            <Box pos="relative" w="250px">
              <Input 
                className="peer" 
                placeholder=" "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Field.Label css={floatingStyles}>Search by name</Field.Label>
            </Box>
          </Field.Root>

          
          <Box 
            borderWidth="1px" 
            borderRadius="md" 
            p={4} 
            boxShadow="sm" 
            width="250px"
            _hover={{ boxShadow: 'md' }}
          >
            <Heading size="sm" mb={3}>Filter by price</Heading>
            <Flex direction="column" gap={2}>
              {['low', 'medium', 'high'].map((option) => (
                <label key={option} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Box 
                    as="input"
                    type="radio"
                    name="price"
                    value={option}
                    checked={priceFilter === option}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    display="inline-block"
                    width="16px"
                    height="16px"
                    border="2px solid #3182ce"
                    borderRadius="50%"
                    mr={2}
                    cursor="pointer"
                    position="relative"
                    _checked={{
                      backgroundColor: "#3182ce",
                      boxShadow: "inset 0 0 0 4px white",
                    }}
                    _focusVisible={{ outline: "2px solid #3182ce" }}
                  />
                  <Box 
                    _hover={{ color: 'blue.500' }} 
                    transition="color 0.2s ease"
                    fontWeight={priceFilter === option ? 'bold' : 'normal'}
                  >
                    {option === 'low' ? 'Below $20' : option === 'medium' ? '$20 - $50' : 'Above $50'}
                  </Box>
                </label>
              ))}
            </Flex>
          </Box>

         
          <Box 
            borderWidth="1px" 
            borderRadius="md" 
            p={4} 
            boxShadow="sm" 
            width="250px"
            _hover={{ boxShadow: 'md' }}
          >
            <Heading size="sm" mb={3}>Filter by stock</Heading>
            <Flex direction="column" gap={2}>
              {['in', 'out'].map((option) => (
                <label key={option} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Box 
                    as="input"
                    type="radio"
                    name="stock"
                    value={option}
                    checked={stockFilter === option}
                    onChange={(e) => setStockFilter(e.target.value)}
                    display="inline-block"
                    width="16px"
                    height="16px"
                    border="2px solid #3182ce"
                    borderRadius="50%"
                    mr={2}
                    cursor="pointer"
                    position="relative"
                    _checked={{
                      backgroundColor: "#3182ce",
                      boxShadow: "inset 0 0 0 4px white",
                    }}
                    _focusVisible={{ outline: "2px solid #3182ce" }}
                  />
                  <Box 
                    _hover={{ color: 'blue.500' }} 
                    transition="color 0.2s ease"
                    fontWeight={stockFilter === option ? 'bold' : 'normal'}
                  >
                    {option === 'in' ? 'In Stock' : 'Out of Stock'}
                  </Box>
                </label>
              ))}
            </Flex>
          </Box>

          
          <Button
            onClick={clearAllFilters}
            colorScheme="gray"
            variant="outline"
            size="md"
            isDisabled={!search && !priceFilter && !stockFilter}
            _hover={{ bg: 'gray.100' }}
            width="250px"
          >
            Clear Filters
          </Button>
        </Flex>

       
        <Box flex="3">
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={10} gap={10}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCardClt key={product._id || product.id} product={product} />
              ))
            ) : (
              <Box>No products found</Box>
            )}
          </SimpleGrid>
        </Box>
      </Flex>
    </Box>
  );
};

export default Store;
