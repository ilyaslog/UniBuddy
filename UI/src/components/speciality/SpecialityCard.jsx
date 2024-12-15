import React from 'react'
import { Button, Icon, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

function SpecialityCard({ name, icon }) {
  return (
    <Button
      as={RouterLink}
      to="/chat"
      height="180px"
      flexDirection="column"
      p={8}
      bg="white"
      boxShadow="lg"
      borderRadius="xl"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'xl',
      }}
      transition="all 0.2s"
    >
      <Icon 
        as={icon} 
        boxSize={10} 
        mb={4} 
        color="blue.500" 
      />
      <Text fontSize="lg" fontWeight="medium">
        {name}
      </Text>
    </Button>
  )
}

export default SpecialityCard