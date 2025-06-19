import { useState } from "react";

export function useRegisterForm(){
        const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        ci: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setForm({...form, [e.target.name] : e.target.value});
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return {handleChange, handleSubmit}

}