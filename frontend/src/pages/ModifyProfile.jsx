import React, { useEffect, useState, useRef } from 'react';
import { 
  Container, 
  VStack, 
  HStack,
  Input, 
  Button, 
  Text,
  Image,
  Box
} from '@chakra-ui/react';
import { useUserStore } from '@/store/user';
import { useNavigate } from 'react-router-dom';
import { Toaster, toaster } from "@/components/ui/toaster";
import NavbarClient from '@/items/NavbarClient';

const ModifyProfile = () => {
  const { loggedInUser, updateUser, loadUserFromToken, changePassword } = useUserStore();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadUser = async () => {
      await loadUserFromToken();
      setIsLoading(false);
    };
    loadUser();
  }, [loadUserFromToken]);

  useEffect(() => {
    if (!isLoading && !loggedInUser) {
      navigate("/users/login");
      return;
    } else if (loggedInUser) {
      setFormData({
        name: loggedInUser.name || '',
        email: loggedInUser.email || '',
      });
     
      if (loggedInUser.image) {
        setImagePreview(`http://localhost:5000${loggedInUser.image}`);
      }
    }
  }, [loggedInUser, navigate, isLoading]);

 
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    
    
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    setIsUpdating(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const result = await updateUser(loggedInUser._id, formDataToSend);

      if (result.success) {
        toaster.create({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        
        
        if (result.data.image) {
          setImagePreview(`http://localhost:5000${result.data.image}`);
        }
        setImageFile(null);
      } else {
        toaster.create({
          title: "Update failed",
          description: result.message || "Failed to update profile.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "An error occurred while updating your profile.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordSubmit = async () => {
    setIsChangingPassword(true);
    try {
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );
  
      if (result.success) {
        toaster.create({
          title: "Password changed",
          description: "Your password has been updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setShowPasswordForm(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toaster.create({
          title: "Password change failed",
          description: result.message || "Failed to change password.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "An error occurred while changing your password.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.sm" py={12} centerContent>
        <Text>Loading your profile...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.sm" py={12}>
      <NavbarClient />
      <VStack spacing={8} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Edit Profile
        </Text>
        
       
        <VStack spacing={4} align="center">
          <Image 
            src={imagePreview || "https://via.placeholder.com/150"} 
            alt="User Image"
            boxSize="150px"
            borderRadius="full"
            objectFit="cover"
            fallbackSrc="https://via.placeholder.com/150"
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
            width="auto"
          >
            {imageFile ? 'Change Image' : 'Upload New Image'}
          </Button>
          
          {imageFile && (
            <Text fontSize="sm">
              Selected file: {imageFile.name}
            </Text>
          )}
        </VStack>

       
        <VStack spacing={4} align="stretch">
          <Text fontWeight="bold">Full Name</Text>
          <Input
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleInputChange}
          />

          <Text fontWeight="bold">Email Address</Text>
          <Input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleInputChange}
            disabled 
          />
        </VStack>

       
        {showPasswordForm ? (
          <VStack spacing={4} align="stretch">
            <Text fontWeight="bold">Current Password</Text>
            <Input
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />

            <Text fontWeight="bold">New Password</Text>
            <Input
              type="password"
              name="newPassword"
              placeholder="Enter new password (min 6 characters)"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />

            <Text fontWeight="bold">Confirm New Password</Text>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />

            <HStack spacing={4}>
              <Button 
                colorScheme="teal" 
                onClick={handlePasswordSubmit}
                isLoading={isChangingPassword}
              >
                Update Password
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordForm(false)}
                isDisabled={isChangingPassword}
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        ) : (
          <Button 
            variant="link" 
            colorScheme="teal" 
            onClick={() => setShowPasswordForm(true)}
          >
            Change Password
          </Button>
        )}

       
        <Box pt={4}>
          <Button 
            colorScheme="teal" 
            width="full" 
            onClick={handleSubmit}
            isLoading={isUpdating}
            loadingText="Updating..."
          >
            Save Changes
          </Button>
        </Box>
      </VStack>
      <Toaster />
    </Container>
  );
};

export default ModifyProfile;