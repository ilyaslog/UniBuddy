import React from 'react';
import { 
  VStack, 
  Button, 
  Input, 
  FormControl, 
  FormLabel, 
  useToast,
  Text,
  Icon
} from '@chakra-ui/react';
import { FiUpload } from 'react-icons/fi';

function FileUpload({ onFileSelect }) {
  const toast = useToast();
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF file',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  return (
    <VStack spacing={4} w="full" bg="white" p={6} borderRadius="xl" boxShadow="md">
      <FormControl>
        <FormLabel>Upload Lecture PDF</FormLabel>
        <Input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          display="none"
          id="file-upload"
        />
        <Button
          as="label"
          htmlFor="file-upload"
          colorScheme="blue"
          leftIcon={<Icon as={FiUpload} />}
          cursor="pointer"
          w="full"
        >
          Choose File
        </Button>
      </FormControl>
      <Text fontSize="sm" color="gray.600">
        Upload your lecture notes or materials in PDF format to generate a summary
      </Text>
    </VStack>
  );
}

export default FileUpload;