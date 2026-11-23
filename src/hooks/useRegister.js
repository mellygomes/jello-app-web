import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { register } from "../services";

export function useRegister() {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUserName] = useState("");
    const [lastName, setLastName] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorsValidate, setErrorsValidate] = useState({});
    const [submitAttempt, setSubmitAttempt] = useState(0);

    const handleChange = (field, setter) => (event) => {
        setter(event.target.value);
        setErrorsValidate((prev) => {

            if (!prev[field]) return prev
            const {[field]: _, ...rest} = prev;
            return rest;
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        const novosErros = {};

        if (!firstName.trim()) novosErros.firstName = "Campo obrigatório";
        if (!lastName.trim()) novosErros.lastName = "Campo obrigatório";
        if (!email.trim()) novosErros.email = "Campo obrigatório";
        if (!username.trim()) novosErros.username = "Campo obrigatório";

        if (!password) {
            novosErros.password = "Campo obrigatório";
        } else if (password.length < 4) {
            novosErros.password = "A senha deve ter pelo menos 4 caracteres";
        }

        if (password !== confirmPassword) {
            novosErros.confirmPassword = "As senhas não coincidem";
        }

        if (Object.keys(novosErros).length > 0) {
            setErrorsValidate(novosErros);
            setSubmitAttempt((n) => n + 1);   // ← força o shake
            return;
        }

        setErrorsValidate({});
        setLoading(true);

        try {
            await register({
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                password: password,
            })
            navigate("/login");
        } catch (error) {
            setError("Erro ao cadastrar usuário");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return {
        username,
        password,
        confirmPassword,
        email,
        firstName,
        lastName,
        setUserName,
        setPassword,
        setConfirmPassword,
        setEmail,
        setFirstName,
        setLastName,
        error,
        loading,
        errorsValidate,
        submitAttempt,
        handleChange,
        handleRegister
    }
}