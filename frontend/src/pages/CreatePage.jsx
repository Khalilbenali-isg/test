import { useColorMode ,useColorModeValue } from '@/components/ui/color-mode';
import { useProductStore } from '@/store/product';
import { Container , VStack, Heading ,Box, Input } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster"
import { Button ,Image } from '@chakra-ui/react';


import React from 'react'

const CreatePage = () => {
  const [newProduct, setNewProduct] = React.useState({
    name: "",
    price: "",
    age: "",
    Image: "",
  });

  //const toast = useToast();
  //<Toaster />
  
  const{createProduct}=useProductStore();
  const handleAddProduct = async () => {
    const {success,message} = await createProduct(newProduct);
    if(!success){
      toaster.create({
        title:"error",
        description:message,
        status:"error",
        type:"error",
        isClosable:true
      })
    }
    else{
      toaster.create({
        title:"success",
        description:message,
        type:"success",
        isClosable:true
      })
      console.log(message);
    }
    setNewProduct({
      name: "",
      price: "",
      age: "",
      Image : "",
    });
      
    
  }
  return (
    <Container maxW="container.sm">
      <VStack SPACING ={8}>
        <Heading as={"h1"} size={"2xL"} textAlign={"center"} mb={8}>
          create a new product
        </Heading>
        <Box w={"full"} bg={useColorModeValue("white", "gray.700")} p={6} rounded={"lg"} shadow={"md"}>
          <VStack SPACING={4}>
            <Input
              placeholder="Product Name"
              name='name'
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <Input
              placeholder="prix"
              name='price'
              type='number'
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price:Number (e.target.value) })}
            />
            <Input
              placeholder="image URL"
              name='Image'
              value={newProduct.Image}
              onChange={(e) => setNewProduct({ ...newProduct, Image: e.target.value })}

            />
            <Input
              placeholder="Product age"
              name='age'
              type='number'
              value={newProduct.age}
              onChange={(e) => setNewProduct({ ...newProduct, age:Number (e.target.value) })}
            />
            <Input
              placeholder="Product stock"
              name='stock'
              type='number'
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock:Number (e.target.value) })}
            />
            <Button colorScheme="teal" size="lg" onClick={handleAddProduct} w={"full"}>
              Create Product
            </Button>
          </VStack>
        </Box>
        <Image rounded="md" src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
      </VStack>
    </Container>
  )
}

export default CreatePage
