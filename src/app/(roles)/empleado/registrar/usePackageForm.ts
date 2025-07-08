import { useState } from "react";
export default function usePackageForm() {

        const [meterPaquete, setMeterPaquete] = useState(false);
    
        const handleAgregar = (e: React.MouseEvent<HTMLButtonElement>) => {
            setMeterPaquete(true);
        };
    
        const onCancel = (e: React.MouseEvent<HTMLButtonElement> ) => {
            setMeterPaquete(false)
        };
    
        const onSubmit = (data: any) => {
            
            setMeterPaquete(false);
        };


  return {handleAgregar, onCancel, onSubmit, meterPaquete}
}
