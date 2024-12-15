import React from 'react';
import { Box, VStack } from '@chakra-ui/react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';

function ChatWindow({ messages, input, setInput, handleSend }) {
  return (
    <VStack h="full" spacing={0}>
      <ChatHeader />
      <Box 
        flex={1} 
        w="full" 
        p={4} 
        overflowY="auto"
        bg="gray.50"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'gray.200',
            borderRadius: '24px',
          },
        }}
      >
        {messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            message={msg.text}
            sender={msg.sender}
          />
        ))}
      </Box>
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
      />
    </VStack>
  );
}

export default ChatWindow;