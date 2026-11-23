import { useEffect, useState } from "react";
import { useAuth } from "./useAuth.js";
import { bumpImageVersion, getAvatarUrl, getCoverUrl, getProfile, updateProfile } from "../services";
import { getErrorMessage } from "../lib/api";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const USERNAME_REGEX = /^[A-Za-z0-9._-]{3,46}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// confere tipo e tamanho antes de aceitar a imagem escolhida
function validImage(file) {
    return file && IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_SIZE;
}

const emptyForm = {
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    email: "",
    avatar: "",
    cover: "",
    posts: 0,
    followers: 0,
    following: 0,
};

function profileToForm(profile) {
    return {
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        username: profile.username ?? "",
        bio: profile.bio ?? "",
        email: profile.email ?? "",
        avatar: profile.avatar ?? "",
        cover: profile.cover ?? "",
        posts: profile.posts ?? 0,
        followers: profile.followers ?? 0,
        following: profile.following ?? 0,
    }
}

export function useLoggedProfile() {
    const {user, loading, refreshUser} = useAuth();

    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [profileLoading, setLoadingProfile] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [errorsValidate, setErrorsValidate] = useState({})
    const [submitAttempt, setSubmitAttempt] = useState(0)

    useEffect(() => {

        if (loading) return;

        if (!user) return;

        let cancelled = false;

        async function loadProfile() {
            try {
                const response = await getProfile()
                const loadedProfile = response.data;

                if (!loadedProfile) {
                    throw new Error("A resposta não contém os dados do perfil");
                }

                if (!cancelled) {
                    setProfile(loadedProfile);
                    setFormData(profileToForm(loadedProfile));

                    setAvatarUrl(getAvatarUrl(loadedProfile.avatar?.id));
                    setCoverUrl(getCoverUrl(loadedProfile.cover?.id));
                }
            } catch (error) {
                if (!cancelled) {
                    setError("Não foi possível carregar seu perfil.")
                    console.error("Erro ao carregar perfil: ", error);
                }
            } finally {
                if (!cancelled) setLoadingProfile(false);
            }
        }

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, [user, loading]);

    // atualiza o estado conforme o usuario digitar nos inputs
    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(current => ({
            ...current,
            [name]: value
        }));

        // Isso aqui limpa o erro assim que o usuário começa a digitar de novo
        setErrorsValidate((prev) => {
            if (!prev[name]) return prev;
            const rest = { ...prev };
            delete rest[name];
            return rest;
        });
    };

    function handleAvatarChange(info) {
        const file = info.file.originFileObj || info.file;
        if (!file) return;
        if (!validImage(file)) {
            setError("A foto precisa ser JPG, PNG, WEBP ou GIF de até 5 MB.");
            return;
        }
        setError("");

        setAvatarFile(file);
        const previewUrl = URL.createObjectURL(file);
        setAvatarUrl(previewUrl);
    }

    function handleCoverChange(info) {
        const file = info.file.originFileObj || info.file;
        if (!file) return;
        if (!validImage(file)) {
            setError("A capa precisa ser JPG, PNG, WEBP ou GIF de até 5 MB.");
            return;
        }
        setError("");

        setCoverFile(file);
        const previewUrl = URL.createObjectURL(file);
        setCoverUrl(previewUrl);
    }

    function handleCancel() {
        setIsEditing(false);
        setErrorsValidate({});
        setError("");
        setAvatarFile(null);
        setCoverFile(null);

        // volta pro que está salvo
        if (profile) {
            setFormData(profileToForm(profile));
            setAvatarUrl(getAvatarUrl(profile.avatar?.id));
            setCoverUrl(getCoverUrl(profile.cover?.id));
        }
    }

    async function handleSave() {
        setError("");

        setErrorsValidate({})

        const novosErros = {}

        if (!formData.firstName.trim()) novosErros.firstName = 'Campo obrigatório'
        if (!formData.email.trim())     novosErros.email = 'Campo obrigatório'
        if (!formData.username.trim())  novosErros.username = 'Campo obrigatório'
        else if (!USERNAME_REGEX.test(formData.username.trim())) novosErros.username = 'Use de 3 a 46 letras, números, ponto, hífen ou _'
        if (!formData.lastName.trim())  novosErros.lastName = 'Campo obrigatório'
        if (formData.email.trim() && !EMAIL_REGEX.test(formData.email.trim())) novosErros.email = 'Digite um e-mail válido'

        if (Object.keys(novosErros).length > 0) {
            setErrorsValidate(novosErros)
            setSubmitAttempt((n) => n + 1)
            return
        }

        setSaving(true);

        try {
            const body = new FormData();

            body.append("firstName", formData.firstName);
            body.append("lastName", formData.lastName);
            body.append("username", formData.username);
            body.append("email", formData.email);
            body.append("bio", formData.bio);

            if (avatarFile) {
                body.append("avatar", avatarFile);
            }

            if (coverFile) {
                body.append("cover", coverFile);
            }

            const response = await updateProfile(body);

            const savedUser = response.data;
            if (avatarFile || coverFile) bumpImageVersion();

            if (!savedUser) {
                throw new Error("Resposta inesperada do servidor");
            }

            setProfile(savedUser);
            setFormData(profileToForm(savedUser));
            setAvatarUrl(getAvatarUrl(savedUser.avatar?.id));
            setCoverUrl(getCoverUrl(savedUser.cover?.id));
            setAvatarFile(null);
            setCoverFile(null);
            setIsEditing(false);

            // atualiza nome e foto do menu lateral
            refreshUser();
        } catch (error) {
            setError(getErrorMessage(error, "Não foi possivel salvar as alterações."));
            console.error("Erro ao atualizar perfil:", error);
        } finally {
            setSaving(false);
        }

    }

    // sem usuário não tem o que carregar
    const loadingProfile = loading || (Boolean(user) && profileLoading);

    return {
        profile,
        formData,
        avatarUrl,
        coverUrl,
        isEditing,
        loading,
        user,
        loadingProfile,
        saving,
        error,
        errorsValidate,
        submitAttempt,
        setIsEditing,
        handleChange,
        handleAvatarChange,
        handleCoverChange,
        handleCancel,
        handleSave
    }
}