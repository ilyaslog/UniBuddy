import React from 'react'
import {
  Box,
  SimpleGrid,
  VStack,
  Text,
  Container,
  Heading
} from '@chakra-ui/react'
import Logo from '../components/Logo'
import SpecialtyCard from '../components/specialty/SpecialtyCard'
import { specialties } from '../constants/specialties'

function SpecialityChoice() {
  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="6xl">
        <VStack spacing={12}>
          <Logo size="lg" />
          <Box textAlign="center">
            <Heading size="lg" mb={2}>Choose Your Path</Heading>
            <Text fontSize="lg" color="gray.600">
              Select your computer science specialty to begin your learning journey
            </Text>
          </Box>
          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 3 }} 
            spacing={8} 
            w="full"
          >
            {specialties.map((specialty) => (
              <SpecialtyCard
                key={specialty.name}
                name={specialty.name}
                icon={specialty.icon}
                description={specialty.description}
              />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}

export default SpecialityChoice