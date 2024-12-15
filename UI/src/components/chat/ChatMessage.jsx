import React from 'react'
import { Box, Text } from '@chakra-ui/react'

function ChatMessage({ message, sender }) {
  return (
    <Box 
      bg={sender === 'user' ? 'blue.100' : 'gray.100'}
      p={3}
      borderRadius="lg"
      mb={2}
      ml={sender === 'user' ? 'auto' : 0}
      mr={sender === 'ai' ? 'auto' : 0}
      maxW="80%"
    >
      <Text fontSize="sm">{message}</Text>
    </Box>
  )
}

export default ChatMessage