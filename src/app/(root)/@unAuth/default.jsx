import React from 'react'
import { AuthFormView } from './_components/auth-form-view'

function AuthPage() {
  return (
    <div className='text-center mx-auto'>
      <h2 className='text-4xl my-15'>
        Welcome to <span className='font-pacifico text-primary'>Task Manager</span>
      </h2>
      <AuthFormView />
    </div>
  )
}

export default AuthPage