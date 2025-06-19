"use client"
import { LoginForm } from "./components/LoginForm";
import { useLoginForm } from "./hooks/useLoginForm";

export function Login() {
    const {handleChange, handleSubmit} = useLoginForm()
    return <LoginForm onChange={handleChange} onSubmit={handleSubmit}></LoginForm>
}

export default Login;


