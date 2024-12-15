import React, { useState } from 'react';
import {
  VStack,
  Box,
  Heading,
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import QuizQuestion from '../../components/quiz/QuizQuestion';
import QuizProgress from '../../components/quiz/QuizProgress';
import QuizCreator from '../../components/quiz/QuizCreator';

function Quiz() {
  const [questions, setQuestions] = useState([
    {
      question: 'What is React?',
      options: [
        'A JavaScript library',
        'A database',
        'A programming language',
        'An operating system'
      ],
      correctAnswer: 'A JavaScript library',
    }
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      toast({
        title: 'Correct!',
        status: 'success',
        duration: 2000,
      });
    } else {
      toast({
        title: 'Incorrect',
        description: `Correct answer: ${questions[currentQuestion].correctAnswer}`,
        status: 'error',
        duration: 3000,
      });
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
      setSelectedAnswer('');
    }
  };

  const handleCreateQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
    onClose();
    toast({
      title: 'Question added',
      status: 'success',
      duration: 2000,
    });
  };

  return (
    <Box h="full" overflowY="auto" px={4} py={2}>
      <VStack spacing={6} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="md">Quiz</Heading>
          <Button 
            colorScheme="blue" 
            size="sm" 
            onClick={onOpen}
          >
            Create New Question
          </Button>
        </Box>

        <QuizProgress
          currentQuestion={currentQuestion + 1}
          totalQuestions={questions.length}
          score={score}
        />

        <QuizQuestion
          question={questions[currentQuestion].question}
          options={questions[currentQuestion].options}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={setSelectedAnswer}
          onSubmit={handleSubmit}
        />

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Question</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <QuizCreator onCreateQuestion={handleCreateQuestion} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}

export default Quiz;