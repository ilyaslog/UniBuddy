import React, { useState } from 'react';
import { 
  VStack, 
  Container, 
  Heading, 
  Box,
  Text,
} from '@chakra-ui/react';
import FileUpload from '../../components/summary/FileUpload';

function Summary() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    // Here you'll implement the PDF processing logic
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Learning Summary</Heading>
        
        <FileUpload onFileSelect={handleFileSelect} />
        
        {selectedFile && (
          <Box>
            <Text fontWeight="medium" mb={2}>
              Selected file: {selectedFile.name}
            </Text>
            <Text color="gray.600" fontSize="sm">
              Processing your document...
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
}

export default Summary;