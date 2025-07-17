"use client";

import Link from "next/link";
import { Truck, Package, Globe } from 'lucide-react'; 

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-900 to-blue-950 text-white overflow-hidden">
      <nav className="bg-transparent px-8 py-3 flex justify-between items-center relative z-10">
        <h1 className="text-2xl font-extrabold text-blue-300 md:text-3xl">CargoTrack</h1>
        <div className="space-x-3 md:space-x-4">
          <Link
            href="/login?tipo=cliente"
            className="bg-white text-blue-900 px-4 py-1.5 rounded-full hover:bg-gray-200 transition duration-300 shadow-lg text-sm md:px-6 md:py-2"
          >
            Acceder como Cliente
          </Link>
          <Link
            href="/login?tipo=empleado"
            className="bg-blue-700 text-white px-4 py-1.5 rounded-full hover:bg-blue-600 transition duration-300 shadow-lg text-sm md:px-6 md:py-2"
          >
            Acceder como Empleado
          </Link>
        </div>
      </nav>

      <section className="flex-grow flex items-center justify-center px-4 py-4 md:px-6 md:py-8 relative z-0">
        <div className="text-center max-w-2xl bg-black bg-opacity-40 p-6 md:p-10 rounded-xl shadow-2xl backdrop-blur-sm border border-blue-700/30">
          <h2 className="
            text-3xl font-extrabold text-white mb-3 leading-tight md:text-5xl md:mb-6
            transition-colors duration-300 ease-in-out hover:text-purple-400
          ">
            Transporte que mueve el futuro
          </h2>
          <p className="text-base text-blue-200 mb-4 leading-relaxed md:text-xl md:mb-8">
            En CargoTruck combinamos innovación, eficiencia y compromiso para ofrecerte una experiencia logística sin fricciones. Desde cargas locales hasta transporte internacional, somos tu socio de confianza en cada kilómetro.
          </p>
        </div>
      </section>

      <section className="py-6 md:py-8 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center px-4 md:gap-8 md:px-6">
          <div className="bg-blue-900 bg-opacity-80 p-4 rounded-xl shadow-xl transform hover:scale-105 transition duration-300 border border-blue-700/40 md:p-6">
            <Truck className="text-4xl mb-2 text-blue-300 md:text-5xl mx-auto" /> 
            <h3 className="text-white font-bold text-lg mb-1 md:text-2xl md:mb-2">Entrega Rápida</h3>
            <p className="text-blue-200 text-xs md:text-base">Rutas optimizadas para una logística sin demoras.</p>
          </div>
          <div className="bg-blue-900 bg-opacity-80 p-4 rounded-xl shadow-xl transform hover:scale-105 transition duration-300 border border-blue-700/40 md:p-6">
            <Package className="text-4xl mb-2 text-blue-300 md:text-5xl mx-auto" />
            <h3 className="text-white font-bold text-lg mb-1 md:text-2xl md:mb-2">Seguimiento en Tiempo Real</h3>
            <p className="text-blue-200 text-xs md:text-base">Monitorea tu carga desde el punto A hasta el B.</p>
          </div>
          <div className="bg-blue-900 bg-opacity-80 p-4 rounded-xl shadow-xl transform hover:scale-105 transition duration-300 border border-blue-700/40 md:p-6">
            <Globe className="text-4xl mb-2 text-blue-300 md:text-5xl mx-auto" />
            <h3 className="text-white font-bold text-lg mb-1 md:text-2xl md:mb-2">Cobertura Nacional</h3>
            <p className="text-blue-200 text-xs md:text-base">Presencia en más de 20 estados del país.</p>
          </div>
        </div>
      </section>

      <footer className="bg-black bg-opacity-50 py-3 text-center text-xs text-blue-300 relative z-10 border-t border-blue-900/50 md:py-4 md:text-sm">
        © {new Date().getFullYear()} CargoTruck. Todos los derechos reservados.
      </footer>
    </div>
  );
}