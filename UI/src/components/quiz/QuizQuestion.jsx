import React from 'react';
import { VStack, Text, RadioGroup, Radio, Button } from '@chakra-ui/react';

function QuizQuestion({ question, options, selectedAnswer, onAnswerSelect, onSubmit }) {
  return (
    <VStack spacing={4} align="stretch" bg="white" p={4} borderRadius="lg">
      <Text fontSize="lg" fontWeight="medium">
        {question}
      </Text>
      <RadioGroup value={selectedAnswer} onChange={onAnswerSelect}>
        <VStack spacing={3} align="stretch">
          {options.map((option, index) => (
            <Radio key={index} value={option}>
              {option}
            </Radio>
          ))}
        </VStack>
      </RadioGroup>
      <Button 
        colorScheme="blue" 
        onClick={onSubmit} 
        isDisabled={!selectedAnswer}
        size="sm"
      >
        Submit Answer
      </Button>
    </VStack>
  );
}

export default QuizQuestion;