

const handleLogin = async (e) => {
    e.preventDefault()

    const novosErros = {}

    if (!username.trim()) novosErros.username = 'Campo obrigatório'
    if (!password.trim()) novosErros.password = 'Campo obrigatório'

    if (Object.keys(novosErros).length > 0) {
        setErrorsValidate(novosErros)
        setSubmitAttempt((n) => n + 1)   // ← força o shake
        return
    }

    setErrorsValidate({})
    setLoading(true)

    try {
        // Envia os dados de login
        await logIn({ username, password });

        // Valida o login e retorna com os dados caso estejam corretos
        const response = await getUserLogged()
        login(response.data);
        navigate("/");

    } catch (error) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        // Traduzir pro usuário
        const mensagens = {
            "Bad credentials": "Usuário ou senha inválidos",
            "User not found": "Usuário não encontrado",
        };

        const mensagemTraduzida = mensagens[message] ?? "Erro ao fazer login";
        setErro(mensagemTraduzida);

        if (status === 401) {
            setErro("Usuário ou senha inválidos");
        } else {
            setErro("Erro ao fazer login. Tente novamente.");
        }

        console.error("Erro ao fazer login:", error);

        setSubmitAttempt((n) => n + 1);   // pra ter animação de novo
    } finally {
        setLoading(false)
    }
}