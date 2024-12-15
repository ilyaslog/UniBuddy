import React from 'react'
import {
  VStack,
  Box,
  Text,
  Button,
  Icon,
} from '@chakra-ui/react'
import { 
  FiMessageSquare, 
  FiBookmark, 
  FiHelpCircle 
} from 'react-icons/fi'

const sidebarItems = [
  { icon: FiMessageSquare, label: 'Recent Chats' },
  { icon: FiBookmark, label: 'Saved Messages' },
  { icon: FiHelpCircle, label: 'Help & Support' }
]

function ChatSidebar() {
  return (
    <Box w="250px" bg="gray.50" borderRight="1px" borderColor="gray.200" h="full">
      <Box p={4} borderBottom="1px" borderColor="gray.200">
        <Text fontSize="lg" fontWeight="semibold">Chat History</Text>
      </Box>
      <VStack p={2} spacing={1} align="stretch">
        {sidebarItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            justifyContent="flex-start"
            py={2}
            px={3}
            borderRadius="md"
            leftIcon={<Icon as={item.icon} color="gray.600" />}
            _hover={{ bg: 'gray.100' }}
          >
            <Text fontSize="sm">{item.label}</Text>
          </Button>
        ))}
      </VStack>
    </Box>
  )
}

export default ChatSidebar