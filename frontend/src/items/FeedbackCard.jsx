
import { Box, Flex, Text, Badge, Image } from "@chakra-ui/react";
import { useUserStore } from "@/store/user";
import { useEffect } from "react";

const FeedbackCard = ({ feedback }) => {
  const { users, fetchUsers } = useUserStore();
  
  useEffect(() => {
    
    if (users.length === 0) {
      fetchUsers();
    }
  }, [fetchUsers, users.length]);
  
  console.log(users);
  const user = users.find(u => u._id === feedback.userId);
  
  
  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Recent";
    }
  };
  
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden"
      boxShadow="md"
      p={4}
     
      display="flex"
      flexDirection="column"
    >
      <Flex align="center" mb={3}>
        {user?.image ? (
          <Image
          src={`http://localhost:5000${user.image}`} 
            alt={user.name || "User"}
            boxSize="40px"
            borderRadius="full"
            mr={2}
            objectFit="cover"
          />
        ) : (
          <Box 
            
            color="white" 
            borderRadius="full" 
            width="40px" 
            height="40px" 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            mr={2}
          >
            {user?.name?.[0] || "A"}
          </Box>
        )}
        
        <Box>
          <Text fontWeight="bold">{user?.name || "Anonymous"}</Text>
          <Flex align="center">
            {feedback.Verified && (
              <Badge colorScheme="green" mr={2}>Verified</Badge>
            )}
            <Text fontSize="sm" color="gray.500">
              {formatDate(feedback.createdAt)}
            </Text>
          </Flex>
        </Box>
      </Flex>
      
      <Box 
        mt={2} 
        textAlign="left" 
        flex="1"
        borderTop="1px solid"
        borderTopColor="gray.100"
        pt={3}
      >
        <Text>{feedback.message}</Text>
      </Box>
    </Box>
  );
};

export default FeedbackCard;