import React from 'react'
import { Button } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

function AuthButton({ children, to, ...props }) {
  return (
    <Button 
      as={RouterLink} 
      to={to} 
      colorScheme="blue"
      size="lg"
      width="full"
      borderRadius="md"
      {...props}
    >
      {children}
    </Button>
  )
}

export default AuthButton