import { Box, Flex, VStack, Text, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { useUserStore } from '@/store/user'; 
import UserCard from '@/items/UserCard';
import Sidebar from '@/items/Sidebar';
import Navbar from '@/items/Navbar';

const UsersHomePage = () => {
  const { fetchUsers, users } = useUserStore();
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Box>
      <Navbar />
      <Flex>
        
        <Box 
          w={{ base: "70px", md: "250px" }} 
          position="sticky"
          top="0"
          h="calc(100vh - 60px)" 
          borderRight="1px" 
          borderColor="gray.200"
        >
          <Sidebar />
        </Box>
        
        
        <Box flex="1" p={{ base: 4, md: 8 }}>
          <VStack spacing={8} align="stretch">
            <Text
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="bold"
              textAlign="center"
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              
            >
              Current Users
            </Text>
            
            {users.length === 0 && (
              <Text
                fontSize={{ base: "2xl", md: "4xl" }}
                fontWeight="bold"
                textAlign="center"
                bgGradient="linear(to-l, #7928CA, #FF0080)"
                bgClip="text"
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
        </Box>
      </Flex>
    </Box>
  )
};

export default UsersHomePage;