"use client"
import React from 'react'
import { ShipmentsTable } from './components/ShipmentsTable'
import ShipmentsHeader from './components/ShipmentsHeader'
import { ShipmentForm } from './components/ShipmentsForm'

export default function page() {
  return (
    <>
    <ShipmentsHeader></ShipmentsHeader>
    <ShipmentForm></ShipmentForm>
    <h2>Elija que paquetes iran al envio que registraras.</h2>
    <ShipmentsTable></ShipmentsTable>
    </>
  )
}
