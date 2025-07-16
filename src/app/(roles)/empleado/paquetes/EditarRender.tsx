import React from 'react'

export const EditarRender = (_: any, row: any) => (
            <button
                onClick={() => handleEdit(row)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
            >
                ✎ Editar
            </button>
        )
