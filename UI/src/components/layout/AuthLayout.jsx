import React from 'react'
import { Box, Container, VStack } from '@chakra-ui/react'
import Logo from '../Logo'

function AuthLayout({ children }) {
  return (
    <Box minH="100vh" bg="gray.50" py={20}>
      <Container maxW="md">
        <VStack 
          spacing={8} 
          bg="white" 
          p={8} 
          borderRadius="xl" 
          boxShadow="xl"
        >
          <Logo size="lg" />
          {children}
        </VStack>
      </Container>
    </Box>
  )
}

export default AuthLayout