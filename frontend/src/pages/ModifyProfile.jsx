import React, { useEffect, useState } from 'react';
import { Container, VStack, Input, Button, Text } from '@chakra-ui/react';
import { useUserStore } from '@/store/user';
import { useNavigate } from 'react-router-dom';

const ModifyProfile = () => {
  const { loggedInUser, updateUser } = useUserStore();
  const navigate = useNavigate();
  console.log(loggedInUser)

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/users/login'); // redirect if not logged in
    } else {
      // pre-fill form fields with current user data
      setName(loggedInUser.name);
      setEmail(loggedInUser.email);
      setImage(loggedInUser.image);
    }
  }, [loggedInUser, navigate]);

  const handleSubmit = async () => {
    const updatedUser = { name, email, image };
    const result = await updateUser(loggedInUser._id, updatedUser);

    if (result.success) {
      alert('Profile updated successfully!');
      navigate('/');
    } else {
      alert(result.message);
    }
  };

  return (
    <Container maxW="container.sm" py={12}>
      <VStack spacing={4}>
        <Text fontSize="3xl" fontWeight="bold">
          Modify Your Profile
        </Text>
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleSubmit}>
          Save Changes
        </Button>
      </VStack>
    </Container>
  );
};

export default ModifyProfile;
