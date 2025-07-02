import React from 'react'
import { RegisterStoreForm} from './components/RegisterStore'

export default function page() {
  return (
    <>
    <h1 className='text-center text-2xl font-bold py-4'>Registrar un almacen</h1>
    <RegisterStoreForm></RegisterStoreForm>
    </>
  )
}
