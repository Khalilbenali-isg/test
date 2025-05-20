import React, { useState } from "react";
import { Box, Heading, VStack, Text, Button, Code } from "@chakra-ui/react";
import { useColorModeValue } from '@/components/ui/color-mode';
import Crossword from "@jaredreisinger/react-crossword";
import { useLeaderboardStore } from "@/store/LeaderboardStore";
import { useUserStore } from "@/store/user";
import { Toaster, toaster } from "@/components/ui/toaster";

const data = {
  across: {
    1: {
      clue: "KHALIL",
      answer: "KHALIL",
      row: 0,
      col: 0,
    },
    4: {
      clue: "IZI",
      answer: "III",
      row: 2,
      col: 3,
    },
  },
  down: {
    2: {
      clue: "AHMED",
      answer: "AHMED",
      row: 0,
      col: 2,
    },
    3: {
      clue: "EZY",
      answer: "IZI",
      row: 0,
      col: 4,
    },
  },
};

const CrosswordGame = () => {
  const bg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.300", "gray.600");
  const { loggedInUser } = useUserStore();
  const { addScore } = useLeaderboardStore();
  const [startTime] = useState(Date.now());
  const [completed, setCompleted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [debugInfo, setDebugInfo] = useState(null);
  const crosswordRef = React.useRef();

  const handleComplete = async (isCorrect) => {
    if (isCorrect && !completed) {
      submitScore();
    }
  };

  const checkCompletion = () => {
    if (crosswordRef.current) {
      
      const currentAnswers = crosswordRef.current.getCurrentAnswers();
      
     
      const debugData = {
        expectedAnswers: {
          across: {
            1: data.across[1].answer,
            4: data.across[4].answer,
          },
          down: {
            2: data.down[2].answer,
            3: data.down[3].answer,
          }
        },
        userAnswers: currentAnswers,
        isCorrect: crosswordRef.current.isCrosswordCorrect()
      };
      
      setDebugInfo(debugData);

      if (debugData.isCorrect) {
        submitScore();
      } else {
        toaster.create({
          title: "Answers don't match",
          description: "Check the debug information below",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const submitScore = () => {
    const endTime = Date.now();
    const timeTakenSeconds = Math.floor((endTime - startTime) / 1000);
    setTimeTaken(timeTakenSeconds);
    setCompleted(true);

    const baseScore = 1000;
    const timePenalty = Math.min(timeTakenSeconds * 10, 500);
    const score = Math.max(baseScore - timePenalty, 300);

    if (loggedInUser) {
      addScore('crossword', score, timeTakenSeconds)
        .then(result => {
          if (result.success) {
            toaster.create({
              title: "Congratulations!",
              description: `You scored ${score} points in ${timeTakenSeconds} seconds!`,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          }
        })
        .catch(error => {
          toaster.create({
            title: "Error saving score",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };

  return (
    <Box
      maxW="800px"
      mx="auto"
      mt={10}
      p={6}
      bg={bg}
      borderRadius="lg"
      boxShadow="md"
      border="1px"
      borderColor={border}
    >
      <VStack spacing={4} align="start">
        <Heading size="lg" color="teal.500">
          Crossword Puzzle
        </Heading>
        <Text fontSize="md" color="gray.500">
          Fill in all the words correctly to complete the puzzle.
          {completed && (
            <Text fontWeight="bold" color="green.500" mt={2}>
              Puzzle completed in {timeTaken} seconds!
            </Text>
          )}
        </Text>
        <Box
          w="100%"
          borderRadius="md"
          bg={useColorModeValue("gray.50", "gray.800")}
          p={4}
        >
          <Crossword
            ref={crosswordRef}
            data={data}
            onCrosswordComplete={(isCorrect) => handleComplete(isCorrect)}
            theme={{
              columnBreakpoint: "500px",
              gridBackground: useColorModeValue("#f7fafc", "#2D3748"),
              cellBackground: useColorModeValue("#fff", "#4A5568"),
              cellBorder: useColorModeValue("#CBD5E0", "#718096"),
              textColor: useColorModeValue("#2D3748", "#E2E8F0"),
              numberColor: useColorModeValue("#718096", "#CBD5E0"),
              focusBackground: useColorModeValue("#EBF8FF", "#2C5282"),
              highlightBackground: "#38B2AC",
            }}
          />
        </Box>
        <Button 
          colorScheme="teal" 
          onClick={checkCompletion}
          disabled={completed}
        >
          {completed ? "Completed!" : "Check Answers"}
        </Button>

        {debugInfo && (
          <Box mt={4} p={4} bg={useColorModeValue("gray.100", "gray.900")} borderRadius="md">
            <Heading size="sm" mb={2}>Debug Information</Heading>
            <Text fontWeight="bold">Expected Answers:</Text>
            <Code display="block" whiteSpace="pre" mb={4}>
              {JSON.stringify(debugInfo.expectedAnswers, null, 2)}
            </Code>
            <Text fontWeight="bold">Your Answers:</Text>
            <Code display="block" whiteSpace="pre" mb={4}>
              {JSON.stringify(debugInfo.userAnswers, null, 2)}
            </Code>
            <Text fontWeight="bold">Validation Result:</Text>
            <Text color={debugInfo.isCorrect ? "green.500" : "red.500"}>
              {debugInfo.isCorrect ? "CORRECT" : "INCORRECT"}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default CrosswordGame;