import React from 'react'
import { AuthFormView } from './_components/auth-form-view'

function AuthPage() {
  return (
    <div className='text-center mx-auto h-screen'>
      <h2 className='text-4xl'>
        Welcome to <span className='font-pacifico text-primary'>Task Manager</span>
      </h2>
      <p>Log in to use this service</p>
      <AuthFormView />
    </div>
  )
}

export default AuthPage