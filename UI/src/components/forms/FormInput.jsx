import React from 'react'
import { FormControl, FormLabel, Input } from '@chakra-ui/react'

function FormInput({ label, type = 'text', ...props }) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Input 
        type={type}
        size="lg"
        borderRadius="md"
        focusBorderColor="blue.500"
        {...props}
      />
    </FormControl>
  )
}

export default FormInput