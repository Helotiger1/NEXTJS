"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      
      <nav className="bg-black px-8 py-4 flex justify-between items-center border-b border-gray-800">
<h1 className="text-2xl font-bold text-blue-500">CargoTruck</h1>
          <div className="space-x-4">
            <Link
              href="/login?tipo=cliente"
              className="bg-white text-black px-5 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Acceder como Cliente
            </Link>
            <Link
              href="/login?tipo=empleado"
              className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Acceder como Empleado
            </Link>
          </div>
      </nav>

      <section className="flex-grow flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Transporte que mueve el futuro
          </h2>
          <p className="text-lg text-gray-400 mb-6">
            En CargoTruck combinamos innovación, eficiencia y compromiso para ofrecerte una experiencia logística sin fricciones. Desde cargas locales hasta transporte internacional, somos tu socio de confianza en cada kilómetro.
          </p>
        </div>
      </section>
      <section className="bg-black py-2 border-t border-gray-800">
  <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center px-6">
    <div>
      <div className="text-4xl mb-2">🚚</div>
      <h3 className="text-white font-bold text-lg">Entrega Rápida</h3>
      <p className="text-gray-400 text-sm">Rutas optimizadas para una logística sin demoras.</p>
    </div>
    <div>
      <div className="text-4xl mb-2">📦</div>
      <h3 className="text-white font-bold text-lg">Seguimiento en Tiempo Real</h3>
      <p className="text-gray-400 text-sm">Monitorea tu carga desde el punto A hasta el B.</p>
    </div>
    <div>
      <div className="text-4xl mb-2">🌐</div>
      <h3 className="text-white font-bold text-lg">Cobertura Nacional</h3>
      <p className="text-gray-400 text-sm">Presencia en más de 20 estados del país.</p>
    </div>
  </div>
</section>


      <footer className="bg-black py-4 text-center text-sm text-gray-600 border-t border-gray-800">
        © {new Date().getFullYear()} CargoTruck. Todos los derechos reservados.
      </footer>
    </div>
  );
}

