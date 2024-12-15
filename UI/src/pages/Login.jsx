import React from 'react'
import { Text } from '@chakra-ui/react'
import AuthLayout from '../components/layout/AuthLayout'
import FormInput from '../components/forms/FormInput'
import AuthButton from '../components/auth/AuthButton'
import AuthLink from '../components/auth/AuthLink'

function Login() {
  return (
    <AuthLayout>
      <Text fontSize="lg" color="gray.600" textAlign="center">
        Sign in to continue your learning journey
      </Text>
      <FormInput 
        label="Email"
        type="email"
      />
      <FormInput 
        label="Password"
        type="password"
      />
      <AuthButton to="/speciality">
        Sign In
      </AuthButton>
      <AuthLink 
        text="Don't have an account?"
        linkText="Sign up"
        to="/signup"
      />
    </AuthLayout>
  )
}

export default Login