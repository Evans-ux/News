import React from 'react'
import LoginComponent from '@/components/components/LoginComponent'
import { LoginUser } from '@/lib/LoginActio'


const page = () => {
  return (
    <div>

  <LoginComponent createUser={LoginUser} />

    </div>
  )
}

export default page