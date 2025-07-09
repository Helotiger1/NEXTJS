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

        const [editingRow, setEditing] = useState({});

        const handleEdit = (row : any) => setEditing(row);
        const handleCancelEdit = () => setEditing(false)


  return {handleAgregar, onCancel, onSubmit, showForm, handleEdit, handleCancelEdit, editingRow}
}
