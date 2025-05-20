import { useColorModeValue } from '@/components/ui/color-mode'
import { Box, Image, Heading, Text, HStack, IconButton, Button, Input, Stack } from '@chakra-ui/react'
import { MdDelete } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
import React, { useState, useEffect, useRef } from 'react'
import { useUserStore } from '@/store/user'
import { toaster } from '@/components/ui/toaster'
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogRoot,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'

const UserCard = ({ user }) => {
  const [updatedUser, setUpdatedUser] = useState({
    name: user.name,
    email: user.email,
    password: '',
    role: user.role || 'client'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
  const textColor = useColorModeValue('gray.800', 'gray.200')
  const bg = useColorModeValue('white', 'gray.700')
  const { deleteUser, updateUser } = useUserStore()

  
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

    
    setImageFile(file);
    
   
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleDeleteUser = async (uid) => {
    const { success, message } = await deleteUser(uid)
    if (!success) {
      toaster.create({
        title: 'Error',
        description: message,
        status: 'error',
        type: 'error',
        isClosable: true,
      })
    } else {
      toaster.create({
        title: 'Success',
        description: message,
        type: 'success',
        isClosable: true,
      })
    }
  }

  const handleUpdateUser = async (userId) => {
    
    if (!updatedUser.name || !updatedUser.email) {
      toaster.create({
        title: 'Error',
        description: 'Please fill all required fields',
        type: 'error',
        isClosable: true
      });
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      
      const formData = new FormData();
      formData.append('name', updatedUser.name);
      formData.append('email', updatedUser.email);
      if (updatedUser.password) {
        formData.append('password', updatedUser.password);
      }
      formData.append('role', updatedUser.role);
      
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
  
      
      console.log('Sending form data:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      const { success, message, data: updatedUserData } = await updateUser(userId, formData);
      
      if (success) {
        toaster.create({
          title: 'Success',
          description: 'User updated successfully',
          type: 'success',
          isClosable: true,
        });
        
        
        setUpdatedUser({
          ...updatedUserData,
          password: '' 
        });
        
        
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
          setImagePreview(null);
        }
        setImageFile(null);
      } else {
        toaster.create({
          title: 'Error',
          description: message || 'Failed to update user',
          type: 'error',
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Update error:', error);
      toaster.create({
        title: 'Error',
        description: 'An unexpected error occurred',
        type: 'error',
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const toggleRole = () => {
    const currentRole = updatedUser.role || 'client'
    const newRole = currentRole === 'admin' ? 'client' : 'admin'
    setUpdatedUser({ ...updatedUser, role: newRole })
  }
 
  console.log("updatedUser", updatedUser);
  


  return (
    <Box
      overflow={'hidden'}
      bg={bg}
      p={6}
      rounded={'lg'}
      shadow={'lg'}
      _hover={{ transform: 'scale(1.05)' }}
    >
      
      {user && user.image && (
  <Image 
    src={`http://localhost:5000${user.image}`} 
    alt="User Image"
    h={48}
    w="full"
    objectFit="cover"
  />
)}



      <Box p={4} textAlign="center">
        <Heading as="h3" size="md" mb={2}>
          {user.name}
        </Heading>
        <Text fontWeight="bold" fontSize="lg" color={textColor} mb={2}>
          {user.email}
        </Text>
        <Text fontSize="md" color={textColor === 'gray.800' ? 'blue.600' : 'blue.300'} mb={3}>
          Role: {user.role || 'client'}
        </Text>
        <HStack justifyContent="center">
          <IconButton aria-label="Delete User" onClick={() => handleDeleteUser(user._id)}>
            <MdDelete />
          </IconButton>

          <DialogRoot>
            <DialogTrigger asChild>
              <Button><FaEdit /></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>
              <DialogBody pb="4">
                <Stack gap="4">
                  <Field label="Name">
                    <Input
                      placeholder="Name"
                      name="name"
                      value={updatedUser.name}
                      onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                    />
                  </Field>
                  <Field label="Email">
                    <Input
                      placeholder="Email"
                      name="email"
                      value={updatedUser.email}
                      onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                    />
                  </Field>
                  <Field label="Password">
                    <Input
                      placeholder="Password"
                      name="password"
                      type="password"
                      value={updatedUser.password}
                      onChange={(e) => setUpdatedUser({ ...updatedUser, password: e.target.value })}
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
                    
                    
                    {(imagePreview || user.image) && (
                      <Box
                        mt={2}
                        borderWidth="1px"
                        borderRadius="md"
                        overflow="hidden"
                        maxW="100%"
                      >
                        <Image
                          src={imagePreview || user.image}
                          alt="User Preview"
                          maxH="200px"
                          objectFit="contain"
                        />
                      </Box>
                    )}
                  </Field>

                  <Field label="Role">
                    <Button
                      colorScheme={updatedUser.role === 'admin' ? 'purple' : 'gray'}
                      onClick={toggleRole}
                    >
                      {updatedUser.role === 'admin' ? 'Change to Client' : 'Change to Admin'}
                    </Button>
                  </Field>
                </Stack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button 
                  colorScheme="green" 
                  onClick={() => handleUpdateUser(user._id)}
                  isLoading={isSubmitting}
                  loadingText="Updating..."
                  disabled={isSubmitting}
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

export default UserCard