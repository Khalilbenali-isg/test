import { useEffect, useState } from 'react';
import { useUserProductStore } from '@/store/userProducts';
import {
  Box,
  Text,
  Input,
  Button,
  Alert,
  Spinner,
  Badge,
  Flex
} from '@chakra-ui/react';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Sidebar from '@/items/Sidebar';

const AdminBoughtProductsPage = () => {
  const {
    allBoughtProducts,
    adminLoading,
    adminError,
    fetchBoughtProductsPaginated,
  } = useUserProductStore();

  const [filters, setFilters] = useState({
    status: '',
    user: '',
    product: '',
  });

  const [rawProducts, setRawProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch all products once
  useEffect(() => {
    fetchBoughtProductsPaginated(1, 9999, {});
  }, []);

  useEffect(() => {
    if (!adminLoading && allBoughtProducts.length > 0) {
      setRawProducts(allBoughtProducts);
    }
  }, [adminLoading, allBoughtProducts]);

  useEffect(() => {
    const filtered = rawProducts.filter((product) => {
      const matchesStatus = filters.status ? product.status === filters.status : true;
      const matchesUser = filters.user
        ? (product.user?.name?.toLowerCase().includes(filters.user.toLowerCase()) ||
           product.user?._id?.includes(filters.user))
        : true;
      const matchesProduct = filters.product
        ? (product.product?.name?.toLowerCase().includes(filters.product.toLowerCase()) ||
           product.product?._id?.includes(filters.product))
        : true;

      return matchesStatus && matchesUser && matchesProduct;
    });

    setFilteredProducts(filtered);
    setPage(1);
  }, [filters, rawProducts]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < Math.ceil(filteredProducts.length / limit) && setPage(page + 1);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'green';
      case 'delivery': return 'orange';
      default: return 'gray';
    }
  };

  const paginatedProducts = filteredProducts.slice((page - 1) * limit, page * limit);

  return (
    <Flex>
      {/* Sidebar - sticky on the left */}
      <Box
        position="sticky"
        top="0"
        height="100vh"
        minW="250px"
       
        padding="20px"
        
      >
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Box flex="1" padding="20px" maxWidth="100%">
        <Text fontSize="2xl" fontWeight="bold" marginBottom="20px">Bought Products</Text>

        {/* Filters */}
        <Flex gap="10px" marginBottom="20px" flexWrap="wrap">
          <Input
            placeholder="User ID"
            value={filters.user}
            onChange={(e) => handleFilterChange('user', e.target.value)}
            width="200px"
          />
          <Input
            placeholder="Product ID"
            value={filters.product}
            onChange={(e) => handleFilterChange('product', e.target.value)}
            width="200px"
          />
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            style={{
              width: '200px',
              padding: '8px 12px',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
             
              fontSize: '14px'
            }}
          >
            <option value="">All Statuses</option>
            <option value="delivery">Delivery</option>
            <option value="delivered">Delivered</option>
          </select>

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            style={{
              width: '150px',
              padding: '8px 12px',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              
              fontSize: '14px'
            }}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </Flex>

        {/* Error message */}
        {adminError && (
          <Alert status="error" marginBottom="20px" borderRadius="md">
            {adminError}
          </Alert>
        )}

        {/* Loading state */}
        {adminLoading && (
          <Flex justify="center" py={12}>
            <Spinner size="xl" thickness="3px" />
          </Flex>
        )}

        {/* Products list */}
        {!adminLoading && (
          <>
            {paginatedProducts?.length > 0 ? (
              <Box>
                {paginatedProducts.map((product) => (
                  <Box
                    key={product._id}
                    borderWidth="1px"
                    borderRadius="lg"
                    padding="15px"
                    marginBottom="15px"
                  >
                    <Flex justify="space-between">
                      <Text><strong>User:</strong> {product.user?.name || product.user?._id || 'N/A'}</Text>
                      <Text><strong>Product:</strong> {product.product?.name || product.product?._id || 'N/A'}</Text>
                    </Flex>

                    <Flex justify="space-between" mt={2}>
                      <Text><strong>Quantity:</strong> {product.quantity}</Text>
                      <Text><strong>Purchased:</strong> {new Date(product.purchasedAt).toLocaleDateString()}</Text>
                    </Flex>

                    <Flex justify="space-between" mt={2}>
                      <Text>
                        <strong>Status:</strong>
                        <Badge ml={2} colorScheme={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                      </Text>
                      <Text><strong>Delivered:</strong> {product.deliveredAt ? new Date(product.deliveredAt).toLocaleDateString() : 'No'}</Text>
                    </Flex>
                  </Box>
                ))}
              </Box>
            ) : (
              <Text textAlign="center" py={8}>No bought products found</Text>
            )}

            {/* Pagination */}
            {filteredProducts.length > limit && (
              <Flex justify="space-between" mt={6} align="center">
                <Text fontSize="sm">
                  Showing <b>{(page - 1) * limit + 1}</b> to{' '}
                  <b>{Math.min(page * limit, filteredProducts.length)}</b> of{' '}
                  <b>{filteredProducts.length}</b> products
                </Text>
                <Flex gap={2}>
                  <Button
                    leftIcon={<FaArrowLeft />}
                    onClick={handlePrevPage}
                    isDisabled={page === 1 || adminLoading}
                  >
                    Previous
                  </Button>
                  <Button
                    leftIcon={<FaArrowRight />}
                    onClick={handleNextPage}
                    isDisabled={page >= Math.ceil(filteredProducts.length / limit) || adminLoading}
                  >
                    Next
                  </Button>
                </Flex>
              </Flex>
            )}
          </>
        )}
      </Box>
    </Flex>
  );
};

export default AdminBoughtProductsPage;
