import React from 'react'

export const WelcomeHeader = () => {
  return (
    <div className="absolute inset-0 z-10 hidden md:flex items-center justify-start px-20">
            <div className="max-w-md">
              <h2 className="text-4xl font-bold mb-4">¡Bienvenido!</h2>
              <p className="text-lg text-gray-200">
                Accede a tu cuenta para rastrear paquetes, pagar facturas y más.
              </p>
            </div>
          </div>
    
  )
}
