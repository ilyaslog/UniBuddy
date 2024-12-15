import React from 'react';
import { Box, Progress, Text, HStack } from '@chakra-ui/react';

function QuizProgress({ currentQuestion, totalQuestions, score }) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <Box>
      <HStack justify="space-between" mb={2}>
        <Text fontSize="sm" color="gray.600">
          Question {currentQuestion} of {totalQuestions}
        </Text>
        <Text fontSize="sm" color="blue.600" fontWeight="medium">
          Score: {score}/{totalQuestions}
        </Text>
      </HStack>
      <Progress 
        value={progress} 
        colorScheme="blue" 
        borderRadius="full" 
        size="sm"
      />
    </Box>
  );
}

export default QuizProgress;