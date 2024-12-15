import React from 'react';
import { Box, Heading, Text, VStack, Badge } from '@chakra-ui/react';

function SummaryCard({ title, content, tags }) {
  return (
    <Box bg="white" p={6} borderRadius="xl" boxShadow="md">
      <VStack align="stretch" spacing={4}>
        <Heading size="md">{title}</Heading>
        <Text color="gray.600">{content}</Text>
        <Box>
          {tags.map((tag, index) => (
            <Badge
              key={index}
              colorScheme="blue"
              mr={2}
              mb={2}
              borderRadius="full"
              px={3}
              py={1}
            >
              {tag}
            </Badge>
          ))}
        </Box>
      </VStack>
    </Box>
  );
}

export default SummaryCard;