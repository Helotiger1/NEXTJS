"use client"
import React from 'react'
import DynamicCRUD from '@/app/(roles)/(shared)/components/CRUD/DynamicCRUD';
import { Usuario, usuarioService } from '@/app/services/usuarioService';
import { formConfig,initState, getColumns } from './configs';


export const Usuarios = () => {
    return (
        <DynamicCRUD<Usuario> h1Name='Usuarios' formName='Ingrese los datos del almacen'
            id={'id'}
            formConfig={formConfig}
            getColumns={getColumns}
            initState={initState}
            service={usuarioService}></DynamicCRUD>
    );
};