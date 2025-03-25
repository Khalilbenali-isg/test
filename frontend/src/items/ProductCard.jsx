import { useColorMode, useColorModeValue } from '@/components/ui/color-mode'
import { Box, Image , Heading, Text} from '@chakra-ui/react'
import React from 'react'
import {  HStack } from '@chakra-ui/react'
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
import { useState } from "react"



//import { useRef } from "react"


const ProductCard = ({product}) => {
   // const ref = useRef<HTMLInputElement>(null)
    const [updatedProduct, setUpdatedProduct] = useState(product);
    const textColor = useColorModeValue("gray.800","gray.200");
    const bg= useColorModeValue("gray.100","gray.700");
    const {deleteProduct , updateProduct} =useProductStore();
    const handleDeleteProduct = async (pid) => {
        const{success,message}= await deleteProduct(pid);
        if(!success){
            toaster.create({
                    title:"error",
                    description:message,
                    status:"error",
                    type:"error",
                    isClosable:true
                  })
        }else{
            toaster.create({
                title:"success",
                description:message,
                type:"success",
                isClosable:true
              })
        }
    }
    const handleUpdateProduct = async (pid, updatedProduct) => {
        const{success,message}= await updateProduct(pid, updatedProduct);
        console.log(success,message);
    }
  return (
   <Box
    overflow={"hidden"}
    bg={bg}
    p={6}
    rounded={"lg"}
    shadow={"lg"}
    _hover={{transform:"scale(1.05)"}}>
        <Image src={product.Image} alt={product.name} h={48} w='full' objectFit='cover'/>
        <Box p={4}>
            <Heading as='h3' size='md' mb={2}>
            </Heading>
            <Text fontWeight="bold" fontSize="xl"color={textColor} mb={2}> 
                ${product.name}
            </Text>
            <Text >
                ${product.price}
            </Text>
            <Text fontWeight="bold" fontSize="xl"color={textColor} mb={2}> 
                ${product.age}
            </Text>
            <HStack >
                <IconButton >
                    <MdDelete onClick={() =>handleDeleteProduct(product._id)}/>

                </IconButton>    
                <DialogRoot /*initialFocusEl={() => ref.current}*/>
                    <DialogTrigger asChild>
                        <Button><FaEdit />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Dialog Header</DialogTitle>
                        </DialogHeader>
                        <DialogBody pb="4">
                            <Stack gap="4">
                                <Field label="Product Name">
                                    <Input placeholder="name" name='name' value={updatedProduct.name} 
                                    onChange={(e)=> setUpdatedProduct({...updatedProduct,name:e.target.value})}/>
                                </Field>
                                <Field label="Product Price">
                                    <Input /*ref={ref}*/ placeholder="price" name='price' type='number' value={updatedProduct.price}
                                    onChange={(e)=> setUpdatedProduct({...updatedProduct,price:e.target.value})}/>
                                </Field>
                                <Field label="Image URL">
                                    <Input /*ref={ref}*/ placeholder="image" name='image' value={updatedProduct.Image}
                                    onChange={(e)=> setUpdatedProduct({...updatedProduct,Image:e.target.value})}/>
                                </Field>
                            </Stack>
                        </DialogBody>
                        <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button variant="outline" >Cancel</Button>
                        </DialogActionTrigger>
                            <Button onClick={() =>handleUpdateProduct(product._id,updatedProduct)}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </DialogRoot>           
            </HStack>
        </Box>
        
   </Box>
   
  )
}

export default ProductCard
