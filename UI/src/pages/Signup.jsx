import React from 'react'
import { Text } from '@chakra-ui/react'
import AuthLayout from '../components/layout/AuthLayout'
import FormInput from '../components/forms/FormInput'
import AuthButton from '../components/auth/AuthButton'
import AuthLink from '../components/auth/AuthLink'

function Signup() {
  return (
    <AuthLayout>
      <Text fontSize="lg" color="gray.600" textAlign="center">
        Create your account to start learning
      </Text>
      <FormInput 
        label="Name"
        type="text"
      />
      <FormInput 
        label="Email"
        type="email"
      />
      <FormInput 
        label="Password"
        type="password"
      />
      <AuthButton to="/speciality">
        Create Account
      </AuthButton>
      <AuthLink 
        text="Already have an account?"
        linkText="Sign in"
        to="/"
      />
    </AuthLayout>
  )
}

export default Signup