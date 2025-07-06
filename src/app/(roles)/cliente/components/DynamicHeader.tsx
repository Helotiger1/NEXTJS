import React from 'react'

export default function DynamicHeader({h1Text} : {h1Text: string}) {
  return (
    <header className="bg-black px-6 py-4 border border-white rounded">
                <h1 className="text-2xl font-semibold text-white ">
                    {h1Text}
                </h1>
            </header>
  )
}
