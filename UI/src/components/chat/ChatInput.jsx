import React from 'react'
import {
  HStack,
  Input,
  IconButton,
  Box,
} from '@chakra-ui/react'
import { 
  FiSend, 
  FiPaperclip, 
  FiMic, 
  FiPlus 
} from 'react-icons/fi'

function ChatInput({ value, onChange, onSend }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSend()
    }
  }

  return (
    <Box p={4} borderTop="1px" borderColor="gray.200" bg="white">
      <HStack spacing={2}>
        <IconButton
          icon={<FiPlus />}
          variant="ghost"
          rounded="full"
          aria-label="Add attachment"
        />
        <IconButton
          icon={<FiPaperclip />}
          variant="ghost"
          rounded="full"
          aria-label="Attach file"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={handleKeyPress}
          rounded="full"
        />
        <IconButton
          icon={<FiMic />}
          variant="ghost"
          rounded="full"
          aria-label="Voice message"
        />
        <IconButton
          icon={<FiSend />}
          colorScheme="blue"
          rounded="full"
          onClick={onSend}
          aria-label="Send message"
        />
      </HStack>
    </Box>
  )
}

export default ChatInput