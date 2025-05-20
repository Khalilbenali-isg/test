import React, { useState } from "react";
import { Box, Heading, VStack, Text, Button, Code } from "@chakra-ui/react";
import { useColorModeValue } from '@/components/ui/color-mode';
import { useLeaderboardStore } from "@/store/LeaderboardStore";
import { useUserStore } from "@/store/user";
import { Toaster, toaster } from "@/components/ui/toaster";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "Berlin", "Rome"],
    answer: "Paris",
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5"],
    answer: "4",
  },
  {
    question: "Which language is used for React?",
    options: ["Python", "JavaScript", "PHP"],
    answer: "JavaScript",
  },
];

export default function QuizGame() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeTaken, setTimeTaken] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [debugInfo, setDebugInfo] = useState(null);
  
  const { loggedInUser } = useUserStore();
  const { addScore } = useLeaderboardStore();
  

  const bg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.300", "gray.600");

  const handleAnswer = (option) => {
    const isCorrect = option === questions[current].answer;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setDebugInfo(prev => [
      ...(prev || []),
      {
        question: questions[current].question,
        userAnswer: option,
        correctAnswer: questions[current].answer,
        isCorrect
      }
    ]);

    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    const endTime = Date.now();
    const timeTakenSeconds = Math.floor((endTime - startTime) / 1000);
    setTimeTaken(timeTakenSeconds);
    setCompleted(true);
    
    // Calculate score
    const baseScore = 1000;
    const correctAnswersBonus = (score / questions.length) * 500;
    const timePenalty = Math.min(timeTakenSeconds * 10, 500);
    const calculatedScore = Math.max(baseScore - timePenalty + correctAnswersBonus, 300);
    const finalCalculatedScore = Math.round(calculatedScore);
    
    setFinalScore(finalCalculatedScore);
    
    if (loggedInUser) {
      try {
        const result = await addScore('quiz', finalCalculatedScore, timeTakenSeconds);
        if (result.success) {
          toaster.create({
            title: "Score Saved!",
            description: `Added ${finalCalculatedScore} points to your total!`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        toaster.create({
          title: "Error saving score",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const resetQuiz = () => {
    setCurrent(0);
    setScore(0);
    setCompleted(false);
    setTimeTaken(0);
    setFinalScore(0);
    setDebugInfo(null);
  };

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt={10}
      p={6}
      bg={bg}
      borderRadius="lg"
      boxShadow="md"
      border="1px"
      borderColor={border}
    >
      <VStack spacing={5} align="start">
        <Heading size="lg" color="teal.500">
          Quick Quiz
        </Heading>

        {!completed ? (
          <Box width="100%">
            <Text fontSize="md" color="gray.500">
              Question {current + 1} of {questions.length}
            </Text>
            <Text fontSize="xl" fontWeight="bold" mt={2}>
              {questions[current].question}
            </Text>
            <VStack mt={4} spacing={2} align="stretch" width="100%">
              {questions[current].options.map((opt) => (
                <Button
                  key={opt}
                  colorScheme="teal"
                  variant="outline"
                  width="100%"
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </Button>
              ))}
            </VStack>
          </Box>
        ) : (
          <Box width="100%">
            <Text fontSize="xl" fontWeight="bold" color="green.500">
              Quiz Completed!
            </Text>
            <Text fontSize="md" mt={2}>
              You answered {score} out of {questions.length} questions correctly in {timeTaken} seconds!
            </Text>
            <Text fontSize="lg" fontWeight="bold" mt={2}>
              Final Score: {finalScore} points
            </Text>
            
            <Button 
              colorScheme="teal" 
              mt={4}
              onClick={resetQuiz}
            >
              Take Quiz Again
            </Button>
            
            {debugInfo && (
              <Box mt={6} p={4} bg={useColorModeValue("gray.100", "gray.900")} borderRadius="md">
                <Heading size="sm" mb={2}>Quiz Results</Heading>
                {debugInfo.map((info, index) => (
                  <Box key={index} mb={3} p={2} borderRadius="md" bg={info.isCorrect ? "green.100" : "red.100"}>
                    <Text fontWeight="bold">Question {index + 1}: {info.question}</Text>
                    <Text>Your answer: {info.userAnswer}</Text>
                    <Text>Correct answer: {info.correctAnswer}</Text>
                    <Text fontWeight="bold" color={info.isCorrect ? "green.500" : "red.500"}>
                      {info.isCorrect ? "CORRECT" : "INCORRECT"}
                    </Text>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </VStack>
    </Box>
  );
}