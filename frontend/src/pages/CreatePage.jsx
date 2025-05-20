import { useColorMode, useColorModeValue } from '@/components/ui/color-mode';
import { useProductStore } from '@/store/product';
import { VStack, Heading, Box, Input, Text, Flex } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster"
import { Button, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/user';
import { useEffect, useState, useRef } from 'react';
import Sidebar from '@/items/Sidebar';

const CreatePage = () => {
  const { loggedInUser, loadUserFromToken } = useUserStore();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);
  
  useEffect(() => {
    if (!loggedInUser) {
      navigate("/users/login");
      return;
    }
  }, [loggedInUser, navigate]);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    age: "",
    stock: "",
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const { createProduct } = useProductStore();
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageFile(file);
    
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const handleAddProduct = async () => {
    
    if (!newProduct.name || !newProduct.price || !newProduct.age || !imageFile) {
      toaster.create({
        title: "Error",
        description: "Please fill all required fields and upload an image",
        type: "error",
        isClosable: true
      });
      return;
    }

    setIsSubmitting(true);

    try {
      
      const productData = {
        ...newProduct,
        Image: imageFile 
      };

      const { success, message } = await createProduct(productData);
      
      if (!success) {
        toaster.create({
          title: "Error",
          description: message,
          status: "error",
          type: "error",
          isClosable: true
        });
      } else {
        toaster.create({
          title: "Success",
          description: message,
          type: "success",
          isClosable: true
        });
        navigate('/');
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toaster.create({
        title: "Error",
        description: "Failed to create product. Please try again.",
        type: "error",
        isClosable: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  
  return (
    <Box>
      <Flex>
        
        <Box 
          w={{ base: "70px", md: "250px" }} 
          position="sticky"
          top="0"
          h="100vh"
          borderRight="1px" 
          borderColor="gray.200"
        >
          <Sidebar />
        </Box>
        
        
        <Box flex="1" p={{ base: 4, md: 8 }} maxW={{ md: "700px" }} mx="auto">
          <VStack spacing={8}>
            <Heading as="h1" size="2xl" textAlign="center" mb={8}>
              Create a new product
            </Heading>
            <Box w="full" bg={useColorModeValue("white", "gray.700")} p={6} rounded="lg" shadow="md">
              <VStack spacing={4}>
                <Input
                  placeholder="Product Name"
                  name="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <Input
                  placeholder="Price"
                  name="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                />
                <Input
                  placeholder="Product age"
                  name="age"
                  type="number"
                  value={newProduct.age}
                  onChange={(e) => setNewProduct({ ...newProduct, age: Number(e.target.value) })}
                />
                <Input
                  placeholder="Product stock"
                  name="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                />
                
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                
                <Button 
                  onClick={triggerFileInput} 
                  colorScheme="blue" 
                  w="full"
                >
                  {imageFile ? 'Change Image' : 'Upload Image'}
                </Button>
                
                {imageFile && (
                  <Text fontSize="sm">
                    Selected file: {imageFile.name}
                  </Text>
                )}
                
                {imagePreview && (
                  <Box
                    mt={2}
                    borderWidth="1px"
                    borderRadius="md"
                    overflow="hidden"
                    maxW="100%"
                  >
                    <Image
                      src={imagePreview}
                      alt="Product Preview"
                      maxH="200px"
                      objectFit="contain"
                    />
                  </Box>
                )}
                
                <Button 
                  colorScheme="teal" 
                  size="lg" 
                  onClick={handleAddProduct} 
                  w="full"
                  isLoading={isSubmitting}
                  loadingText="Creating..."
                  disabled={isSubmitting}
                >
                  Create Product
                </Button>
              </VStack>
            </Box>
            
            {loggedInUser && (
              <Box mt={4} textAlign="center">
                <Heading as="h3" size="md" mb={2}>
                  Logged in as: {loggedInUser.email}
                </Heading>
                {loggedInUser.image && (
                  <Image 
                    boxSize="150px"
                    objectFit="cover"
                    rounded="md" 
                    src={loggedInUser.image} 
                    alt={loggedInUser.name || loggedInUser.email || "User profile"} 
                    fallbackSrc="https://via.placeholder.com/150"
                  />
                )}
              </Box>
            )}
            <Toaster />
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default CreatePage;