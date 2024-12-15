import React from 'react'
import { 
  VStack, 
  Icon, 
  Text, 
  Box,
  useColorModeValue
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

function SpecialtyCard({ name, icon, description }) {
  const bgColor = useColorModeValue('white', 'gray.800')
  
  return (
    <Box
      as={RouterLink}
      to="/chat"
      p={6}
      bg={bgColor}
      boxShadow="lg"
      borderRadius="xl"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'xl',
      }}
      transition="all 0.2s"
      cursor="pointer"
      height="100%"
    >
      <VStack spacing={4} align="center">
        <Icon 
          as={icon} 
          boxSize={8} 
          color="blue.500" 
        />
        <Text 
          fontSize="lg" 
          fontWeight="bold"
          textAlign="center"
        >
          {name}
        </Text>
        <Text
          fontSize="sm"
          color="gray.600"
          textAlign="center"
        >
          {description}
        </Text>
      </VStack>
    </Box>
  )
}

export default SpecialtyCard