import React from 'react'
import { RegisterUserForm } from './components/RegisterUser'

export default function page() {
  return (
    <>
    <h1 className='text-center text-2xl font-bold py-4'>Registrar un usuario</h1>
    <RegisterUserForm></RegisterUserForm>
    </>
  )
}
