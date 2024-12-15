import React from 'react'
import {
  Box,
  Flex,
  Text,
  Icon,
} from '@chakra-ui/react'
import { FiUser } from 'react-icons/fi'

function ChatHeader() {
  return (
    <Box p={4} borderBottom="1px" borderColor="gray.200" bg="white">
      <Flex align="center" gap={2}>
        <Icon as={FiUser} boxSize={5} color="blue.500" />
        <Text fontWeight="medium">AI Tutor</Text>
      </Flex>
    </Box>
  )
}

export default ChatHeader