import React from 'react'
import { 
  Box, 
  VStack, 
  Progress, 
  Text,
} from '@chakra-ui/react'
import Logo from './Logo'
import { useLoadingAnimation } from '../hooks/useLoadingAnimation'

function LoadingScreen() {
  const { bounceAnimation } = useLoadingAnimation()

  return (
    <Box
      position="fixed"
      inset={0}
      bg="white"
      zIndex={50}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={8}>
        <Box sx={bounceAnimation}>
          <Logo size="lg" />
        </Box>
        <Box w="200px">
          <Progress 
            size="xs" 
            isIndeterminate 
            colorScheme="blue" 
            borderRadius="full"
          />
        </Box>
        <Text 
          color="gray.600" 
          sx={{ animation: 'pulse 2s infinite' }}
        >
          Loading your learning experience...
        </Text>
      </VStack>
    </Box>
  )
}

export default LoadingScreen