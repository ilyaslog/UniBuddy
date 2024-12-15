import React from 'react'
import { Text, Link as ChakraLink } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

function AuthLink({ text, linkText, to }) {
  return (
    <Text color="gray.600">
      {text}{' '}
      <ChakraLink 
        as={RouterLink} 
        to={to} 
        color="blue.500"
        fontWeight="semibold"
      >
        {linkText}
      </ChakraLink>
    </Text>
  )
}

export default AuthLink