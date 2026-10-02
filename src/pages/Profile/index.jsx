import styles from "./profile.module.css";
import { useAuth } from "../../contexts/auth/useAuth.js";
import { ProfilePic, ProfileCover, ProfileHeader, ProfileDescription, ProfileInput, Button, Spinner } from "../../components";
import { useEffect, useState } from "react";
import { getAvatarUrl, getCoverUrl, getProfile, updateProfile } from "../../services/profile.js";

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

export default function Profile() {

    const {user, loading} = useAuth();

    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [errorsValidate, setErrorsValidate] = useState({})
    const [submitAttempt, setSubmitAttempt] = useState(0)



    useEffect(() => {

        if (loading) return;

        if (!user) {
            setLoadingProfile(false);
            return;
        }

        let cancelled = false;

        async function loadProfile() {
            setLoadingProfile(true);
            setError("");

            try {
                const response = await getProfile()
                const loadedProfile = response.data.data;

                if (!loadedProfile) {
                    throw new Error("A resposta não contém os dados do perfil");
                }

                if (!cancelled) {
                    setProfile(loadedProfile);
                    console.log("LOADED PROFILE:   ", loadedProfile);
                    setAvatarUrl(getAvatarUrl(loadedProfile.avatar?.id));
                    setCoverUrl(getCoverUrl(loadedProfile.cover?.id));
                    setFormData(profileToForm(loadedProfile));
                }
            } catch (error) {
                if (!cancelled) {
                    setError("Não foi possível carregar seu perfil.")
                    console.log("Erro ao carregar perfil: ", error);
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
            const { [name]: _, ...rest } = prev;
            return rest;
        });
    };

    function handleAvatarChange(info) {
        const file = info.file.originFileObj || info.file;
        if (!file) return;

        setAvatarFile(file);
        const previewUrl = URL.createObjectURL(file);
        setAvatarUrl(previewUrl);
    }

    function handleCoverChange(info) {
        const file = info.file.originFileObj || info.file;
        if (!file) return;

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
    }

    async function handleSave() {
        setError("");

        setErrorsValidate({})

        const novosErros = {}

        if (!formData.firstName.trim()) novosErros.firstName = 'Campo obrigatório'
        if (!formData.email.trim())     novosErros.email = 'Campo obrigatório'
        if (!formData.username.trim())  novosErros.username = 'Campo obrigatório'
        if (!formData.lastName.trim())  novosErros.lastName = 'Campo obrigatório'

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

            if (!response?.data?.data) {
                throw new Error("Resposta inesperada do servidor");
            }
            
            const savedUser = response.data.data;
            
            console.log("SAVED USER", savedUser);

            setProfile(savedUser);
            setFormData(profileToForm(savedUser));
            setAvatarUrl(getAvatarUrl(savedUser.avatar?.id));
            setCoverUrl(getCoverUrl(savedUser.cover?.id));
            setAvatarFile(null);
            setCoverFile(null);
            setIsEditing(false);
        } catch (error) {
            setError("Não foi possivel salvar as alterações.");
            console.error("Erro ao atualizar perfil:", error);
        } finally {
            setSaving(false);
        }

    }

    if (loading || loadingProfile) return <p><Spinner size={14} color="#fff" aria-hidden="true" /> Carregando perfil...</p>;
    if (!user) return <p>Entre na sua conta para ver seu perfil.</p>;
    if (!profile && error) return <p>{error}</p>

    return (
        <main className={styles["page-wrapper"]}>

            <div className={styles["profile-container"]}>

                <ProfileCover
                    src={coverUrl}
                    onChange={handleCoverChange}
                    disabled={!isEditing}
                />
                <ProfilePic
                    src={avatarUrl}
                    onChange={handleAvatarChange}
                    disabled={!isEditing}
                />

            </div>

            <div className={`${styles["info-container"]} container`}>
                <div className={styles["header-wrapper"]}>
                    <ProfileHeader
                        name={`${formData.firstName} ${formData.lastName}`}
                        followers={`${profile?.followers ?? 0} seguidores`}
                        following={`${profile?.following ?? 0} seguindo`}
                        posts={`${profile?.posts ?? 0} posts`}
                    />
                    <div className="d-flex gap-2">
                        {isEditing ? (
                            <>
                                <Button
                                    onClick={handleCancel} variant="ghost"> Cancelar
                                </Button>
                                <Button onClick={handleSave} disabled={saving} variant="primary">
                                    {saving ? (
                                        <>
                                            <Spinner size={14} aria-hidden="true" />
                                            <span>Salvando...</span>
                                        </>
                                    ) : (
                                        "Salvar"
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>
                                Editar
                            </Button>
                        )}
                    </div>
                </div>

                <ProfileDescription
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    maxLength={255}
                />

                <div className={`container ${styles["form-wrapper"]}`}>
                    <div className={styles["input-wrapper"]}>
                        <ProfileInput
                            id="firstName"
                            name="firstName"
                            label="Nome"
                            value={formData.firstName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            maxLength={30}
                            errorValidate={errorsValidate.firstName}
                            // Notinhaaa: esse shakeKey serve basicamente pra fazer a validação rodar de novo sempre 
                            // que clica em confirm, daí a animação aparece no campo com erro e usuário pode ver :)  
                            shakeKey={submitAttempt} 
                        />
                        <ProfileInput
                            id="lastName"
                            name="lastName"
                            label="Sobrenome"
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            maxLength={30}
                            errorValidate={errorsValidate.lastName}
                            shakeKey={submitAttempt} 
                        />
                    </div>
                    <div className={styles["input-wrapper"]}>
                        <ProfileInput
                            id="email"
                            name="email"
                            label="E-mail"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            maxLength={80}
                            errorValidate={errorsValidate.email}
                            shakeKey={submitAttempt} 
                        />
                        <ProfileInput
                            id="username"
                            name="username"
                            label="Nome de usuário"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={!isEditing}
                            maxLength={20}
                            errorValidate={errorsValidate.username}
                            shakeKey={submitAttempt} 
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}