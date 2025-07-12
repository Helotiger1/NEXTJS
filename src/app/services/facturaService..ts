import { paquete } from "./paqueteService";

interface facturaPayload {
    detalleFactura : paquete[]
}

interface factura { 
    numero : string
    estado :string 
    metodoPago :string
    cantPiezas : string
}