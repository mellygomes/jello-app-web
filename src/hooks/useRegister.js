import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { register } from "../services";
import { getErrorMessage } from "../lib/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[A-Za-z0-9._-]{3,46}$/;

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
            const rest = { ...prev }
            delete rest[field]
            return rest
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        const novosErros = {};

        if (!firstName.trim()) novosErros.firstName = "Campo obrigatório";
        if (!lastName.trim()) novosErros.lastName = "Campo obrigatório";
        if (!username.trim()) {
            novosErros.username = "Campo obrigatório";
        } else if (!USERNAME_REGEX.test(username.trim())) {
            novosErros.username = "Use de 3 a 46 letras, números, ponto, hífen ou _";
        }

        if (!email.trim()) {
            novosErros.email = "Campo obrigatório";
        } else if (!EMAIL_REGEX.test(email.trim())) {
            novosErros.email = "Digite um e-mail válido";
        }

        if (!password) {
            novosErros.password = "Campo obrigatório";
        } else if (password.length < 8) {
            novosErros.password = "A senha deve ter pelo menos 8 caracteres";
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
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                username: username.trim(),
                email: email.trim(),
                password: password,
            })
            navigate("/login");
        } catch (error) {
            setError(getErrorMessage(error, "Erro ao cadastrar usuário"));
            setSubmitAttempt((n) => n + 1);
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
