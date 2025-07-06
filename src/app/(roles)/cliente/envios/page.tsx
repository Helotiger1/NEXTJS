import React from 'react'
import { ShipmentsTable } from './components/ShipmentsTable'
import SearchForTracking from './components/SearchForTracking'
import DynamicHeader from '../components/DynamicHeader'

export default function page() {
  return (
    <>
    <DynamicHeader h1Text="Historial de envios"></DynamicHeader>
    <SearchForTracking></SearchForTracking>
    <ShipmentsTable></ShipmentsTable>
    </>
  )
}
