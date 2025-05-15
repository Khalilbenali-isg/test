import { useColorMode, useColorModeValue } from '@/components/ui/color-mode'
import { Box, Image, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import { HStack } from '@chakra-ui/react'
import { IconButton } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"
import { useProductStore } from '@/store/product'
import { toaster } from '@/components/ui/toaster'
import { MdDelete } from "react-icons/md";
import { Button, Input, Stack } from "@chakra-ui/react"
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog" 
import { Field } from "@/components/ui/field"
import { FaEdit } from "react-icons/fa";
import { useState, useEffect, useRef } from "react"

const ProductCard = ({product}) => {
    const [updatedProduct, setUpdatedProduct] = useState({
        name: product.name,
        price: product.price,
        age: product.age,
        stock: product.stock
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    
    const textColor = useColorModeValue("gray.800","gray.200");
    const bg = useColorModeValue("gray.100","gray.700");
    const {deleteProduct, updateProduct} = useProductStore();

    // Debugging: Log the product data
    useEffect(() => {
        
    }, [product]);

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Store the file object
        setImageFile(file);
        
        // Create and set preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleDeleteProduct = async (e, pid) => {
        // Stop event propagation
        e.stopPropagation();
        
        const {success, message} = await deleteProduct(pid);
        if(!success){
            toaster.create({
                title: "Error",
                description: message,
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
        }
    };

    const handleUpdateProduct = async (pid) => {
        // Validate inputs
        if (!updatedProduct.name || !updatedProduct.price) {
            toaster.create({
                title: "Error",
                description: "Please fill all required fields",
                type: "error",
                isClosable: true
            });
            return;
        }
    
        setIsSubmitting(true);
    
        try {
            // Create product data with explicit type conversion
            const productData = {
                name: updatedProduct.name,
                price: Number(updatedProduct.price),
                age: Number(updatedProduct.age),
                stock: Number(updatedProduct.stock || 0)
            };
    
            // Only add image if a new one was selected
            if (imageFile) {
                productData.Image = imageFile;
            } else {
                // Keep the existing image path if no new image was selected
                productData.existingImagePath = product.Image;
            }
    
            console.log("Updating product with data:", productData);
            
            const { success, message } = await updateProduct(pid, productData);
            
            if (!success) {
                console.error("Update failed:", message);
                toaster.create({
                    title: "Error",
                    description: message,
                    type: "error",
                    isClosable: true
                });
            } else {
                console.log("Update success:", message);
                const productStore = useProductStore.getState();
        await productStore.fetchProducts();
                toaster.create({
                    title: "Success",
                    description: "Product updated successfully",
                    type: "success",
                    isClosable: true
                });
                
                // Reset image preview after successful update
                if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                    setImagePreview(null);
                }
                setImageFile(null);
            }
        } catch (error) {
            console.error("Error updating product:", error);
            toaster.create({
                title: "Error",
                description: "Failed to update product. Please try again.",
                type: "error",
                isClosable: true
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    console.log('User Image Path:', product.Image);
  console.log('User Data:', product);

    return (
        <Box
            overflow={"hidden"}
            bg={bg}
            p={6}
            rounded={"lg"}
            shadow={"lg"}
            _hover={{transform:"scale(1.05)"}}>
            <Image 
                src={`http://localhost:5173${product.Image}`} 
                alt={product.name}
                h={48}
                w='full'
                objectFit='cover'
            />        
            <Box p={4}>
                <Text fontWeight="bold" fontSize="xl" color={textColor} mb={2}> 
                    {product.name}
                </Text>
                <Text>
                    Price: {product.price}
                </Text>
                <Text fontWeight="bold" fontSize="xl" color={textColor} mb={2}> 
                    Age: {product.age}
                </Text>
                <Text fontWeight="bold" fontSize="xl" color={textColor} mb={2}> 
                    Stock: {product.stock}
                </Text>
                <HStack>
                    <IconButton 
                        aria-label="Delete product"
                        onClick={(e) => handleDeleteProduct(e, product._id)}
                    >
                        <MdDelete />
                    </IconButton>    
                    <DialogRoot>
                        <DialogTrigger asChild>
                            <Button aria-label="Edit product">
                                <FaEdit />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Product</DialogTitle>
                            </DialogHeader>
                            <DialogBody pb="4">
                                <Stack gap="4">
                                    <Field label="Product Name">
                                        <Input 
                                            placeholder="name" 
                                            name='name' 
                                            value={updatedProduct.name} 
                                            onChange={(e) => setUpdatedProduct({...updatedProduct, name: e.target.value})}
                                        />
                                    </Field>
                                    <Field label="Product Price">
                                        <Input 
                                            placeholder="price" 
                                            name='price' 
                                            type='number' 
                                            value={updatedProduct.price}
                                            onChange={(e) => setUpdatedProduct({...updatedProduct, price: e.target.value})}
                                        />
                                    </Field>
                                    <Field label="Product Age">
                                        <Input 
                                            placeholder="age" 
                                            name='age' 
                                            type='number' 
                                            value={updatedProduct.age}
                                            onChange={(e) => setUpdatedProduct({...updatedProduct, age: e.target.value})}
                                        />
                                    </Field>
                                    <Field label="Stock">
                                        <Input 
                                            placeholder="stock" 
                                            name='stock' 
                                            type='number'
                                            value={updatedProduct.stock}
                                            onChange={(e) => setUpdatedProduct({...updatedProduct, stock: e.target.value})}
                                        />
                                    </Field>
                                    
                                    <Field label="Image">
                                       
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
                                            {imageFile ? 'Change Image' : 'Upload New Image'}
                                        </Button>
                                        
                                        {imageFile && (
                                            <Text fontSize="sm" mt={2}>
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
                                    </Field>
                                </Stack>
                            </DialogBody>
                            <DialogFooter>
                                <DialogActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogActionTrigger>
                                <Button 
                                    onClick={() => handleUpdateProduct(product._id)}
                                    isLoading={isSubmitting}
                                    loadingText="Updating..."
                                    disabled={isSubmitting}
                                    colorScheme="teal"
                                >
                                    Save
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </DialogRoot>           
                </HStack>
            </Box>
        </Box>
    )
}

export default ProductCard