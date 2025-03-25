import { Container , VStack , Text , SimpleGrid } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { useUserStore } from '@/store/user'; 
//import Navbar from '@/items/Navbar';
import UserCard from '@/items/UserCard';

const UsersHomePage = () => {
  

  const { fetchUsers, users } = useUserStore();
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Container maxW="container.xl" py={12}>
      
      <VStack spacing={8}>
        <Text
          fontSize="5xl"
          fontWeight="bold"
          textAlign="center"
          bgGradient={"linear(to-l, #7928CA,#FF0080)"}
        >
          Current Users
        </Text>
        {users.length === 0 && (
          <Text
            fontSize="3xl"
            fontWeight="bold"
            textAlign="center"
            bgGradient={"linear(to-l, #7928CA,#FF0080)"}
          >
            No users available
          </Text>
        )}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={20} gap={6} w={"full"}>
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  )
};

export default UsersHomePage;
