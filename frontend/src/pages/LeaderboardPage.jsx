import { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Flex, 
  Select, 
  Spinner,
  Text,
  Avatar,
  Badge,
  
  Stack,
  
  Center
} from '@chakra-ui/react';
import { useLeaderboardStore } from '../store/LeaderboardStore';
import {toaster , Toaster} from "@/components/ui/toaster"
const LeaderboardPage = () => {
  const { scores, loading, error, getTopScores } = useLeaderboardStore();
  const [selectedGame, setSelectedGame] = useState('crossword');
 

  useEffect(() => {
    const fetchScores = async () => {
      try {
        await getTopScores(selectedGame);
      } catch (err) {
        toaster.create({
          title: 'Error loading leaderboard',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    
    fetchScores();
  }, [selectedGame, getTopScores]);

  const gameOptions = [
    { value: 'crossword', label: 'Crossword' },
    { value: 'puzzle', label: 'Puzzle' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'custom', label: 'Custom Game' },
  ];

  const getMedalColor = (rank) => {
    switch(rank) {
      case 1: return 'yellow.400';
      case 2: return 'gray.400';
      case 3: return 'orange.400';
      default: return 'gray.100';
    }
  };

  return (
    <Box p={6} maxWidth="800px" mx="auto">
      <Flex justify="space-between" align="center" mb={8}>
        <Heading as="h1" size="xl">
          Leaderboard
        </Heading>
        <Select 
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          width="200px"
          bg="white"
        >
          {gameOptions.map((game) => (
            <option key={game.value} value={game.value}>
              {game.label}
            </option>
          ))}
        </Select>
      </Flex>

      {loading ? (
        <Center height="200px">
          <Spinner size="xl" />
        </Center>
      ) : error ? (
        <Box p={4} bg="red.50" borderRadius="md">
          <Text color="red.500">{error}</Text>
        </Box>
      ) : (
        <Box 
          bg="white" 
          borderRadius="lg" 
          boxShadow="md" 
          overflow="hidden"
          p={4}
        >
          <Flex 
            justify="space-between" 
            fontWeight="bold" 
            pb={2}
            mb={4}
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            <Text width="15%">Rank</Text>
            <Text width="45%">Player</Text>
            <Text width="20%" textAlign="right">Score</Text>
            <Text width="20%" textAlign="right">Time</Text>
          </Flex>

          <Stack spacing={4}>
            {scores.length > 0 ? (
              scores.map((score, index) => (
                <Flex 
                  key={score._id || index}
                  justify="space-between" 
                  align="center"
                  p={2}
                  _hover={{ bg: 'gray.50' }}
                  borderRadius="md"
                >
                  <Flex width="15%" align="center">
                    <Badge 
                      bg={getMedalColor(index + 1)}
                      color={index < 3 ? 'white' : 'gray.800'}
                      p={1}
                      borderRadius="full"
                      width={8}
                      height={8}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="sm"
                    >
                      {index + 1}
                    </Badge>
                  </Flex>
                  
                  <Flex width="45%" align="center">
                    <Avatar 
                      size="sm" 
                      src={score.userId?.image} 
                      name={score.userId?.name} 
                      mr={3}
                    />
                    <Text fontWeight="medium">
                      {score.userId?.name || 'Anonymous'}
                    </Text>
                  </Flex>
                  
                  <Text width="20%" textAlign="right" fontWeight="bold" color="blue.600">
                    {score.score}
                  </Text>
                  
                  <Text width="20%" textAlign="right">
                    {score.timeTaken ? `${score.timeTaken}s` : 'N/A'}
                  </Text>
                </Flex>
              ))
            ) : (
              <Text color="gray.500" textAlign="center" py={8}>
                No scores available for this game yet
              </Text>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default LeaderboardPage;