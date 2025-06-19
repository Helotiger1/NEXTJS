"use client"
import { RegisterForm } from "./components/RegisterForm";
import { useRegisterForm } from "./hooks/useRegisterForm";


export function Register() {
    const {handleChange, handleSubmit} = useRegisterForm();
    return <RegisterForm onChange={handleChange} onSubmit={handleSubmit}></RegisterForm>
}

export default Register;


