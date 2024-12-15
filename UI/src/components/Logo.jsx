import React from 'react'
import { HStack, Icon, Text } from '@chakra-ui/react'
import { FaGraduationCap } from 'react-icons/fa'

function Logo({ size = 'md' }) {
  const sizes = {
    sm: { icon: 5, text: 'xl' },
    md: { icon: 6, text: '2xl' },
    lg: { icon: 8, text: '3xl' }
  }

  return (
    <HStack spacing={2}>
      <Icon 
        as={FaGraduationCap} 
        w={sizes[size].icon} 
        h={sizes[size].icon} 
        color="blue.500" 
      />
      <Text fontWeight="bold" fontSize={sizes[size].text}>
        Uni<Text as="span" color="blue.500">Buddy</Text>
      </Text>
    </HStack>
  )
}

export default Logo