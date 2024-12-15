import React, { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  RadioGroup,
  Radio,
  Text,
} from '@chakra-ui/react';

function QuizCreator({ onCreateQuestion }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question && options.every(opt => opt.trim()) && correctAnswer) {
      onCreateQuestion({
        question,
        options,
        correctAnswer,
      });
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
    }
  };

  return (
    <VStack as="form" spacing={4} onSubmit={handleSubmit}>
      <FormControl isRequired>
        <FormLabel>Question</FormLabel>
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
        />
      </FormControl>

      <Text fontWeight="medium">Options</Text>
      {options.map((option, index) => (
        <FormControl key={index} isRequired>
          <Input
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
          />
        </FormControl>
      ))}

      <FormControl isRequired>
        <FormLabel>Correct Answer</FormLabel>
        <RadioGroup value={correctAnswer} onChange={setCorrectAnswer}>
          <VStack align="start">
            {options.map((option, index) => (
              <Radio key={index} value={option} isDisabled={!option.trim()}>
                {option || `Option ${index + 1}`}
              </Radio>
            ))}
          </VStack>
        </RadioGroup>
      </FormControl>

      <Button type="submit" colorScheme="blue" w="full">
        Create Question
      </Button>
    </VStack>
  );
}

export default QuizCreator;