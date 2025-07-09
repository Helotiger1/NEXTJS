import { useState } from "react";
export default function useForm() {

        const [showForm, setShowForm] = useState(false);
    
        const handleAgregar = (e: React.MouseEvent<HTMLButtonElement>) => {
            setShowForm(true);
        };
    
        const onCancel = (e: React.MouseEvent<HTMLButtonElement> ) => {
            setShowForm(false)
        };
    
        const onSubmit = () => {
            setShowForm(false);
        };


  return {handleAgregar, onCancel, onSubmit, showForm}
}
