import { useState } from "react";

export function useLoginForm(){
        const [form, setForm] = useState({
        ci: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setForm({...form, [e.target.name] : e.target.value});
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form);
    };

    return {handleChange, handleSubmit}

}