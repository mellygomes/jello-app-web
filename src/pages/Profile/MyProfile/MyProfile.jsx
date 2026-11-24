import { Link } from "react-router-dom";
import styles from "./my-profile.module.css";
import {
    Button,
    ProfileCover,
    ProfileDescription,
    ProfileHeader,
    ProfileAvatar,
    Spinner,
    TopBar
} from "../../../components";
import ProfileInput from "./ProfileInput";
import { useLoggedProfile } from "../../../hooks";

export default function MyProfile() {

    const {
        profile,
        formData,
        avatarUrl,
        coverUrl,
        isEditing,
        loading,
        loadingProfile,
        saving,
        error,
        user,
        errorsValidate,
        submitAttempt,
        setIsEditing,
        handleChange,
        handleAvatarChange,
        handleCoverChange,
        handleCancel,
        handleSave
    } = useLoggedProfile();

    if (loading || loadingProfile) {
        return <p className="page-loading"><Spinner size={22} color="#282828" aria-hidden="true" />&nbsp;Carregando perfil...</p>;
    }
    if (!user) return <p className="page-loading">Entre na sua conta para ver seu perfil.</p>;
    if (!profile) {
        // sem perfil carregado a pessoa ainda pode sair ou tentar de novo
        return (
            <>
                <TopBar />
                <div className={styles["load-error"]}>
                    <p>{error || "Não foi possível carregar seu perfil."}</p>
                    <Button onClick={() => window.location.reload()}>Tentar de novo</Button>
                </div>
            </>
        );
    }

    return (
        <main className={styles["page-wrapper"]}>
            <TopBar />

            <div className={styles["cover-area"]}>
                <ProfileCover
                    src={coverUrl}
                    onChange={handleCoverChange}
                    disabled={!isEditing}
                />
            </div>

            <div className={styles["info-container"]}>
                <div className={styles["avatar-col"]}>
                    <ProfileAvatar
                        src={avatarUrl}
                        onChange={handleAvatarChange}
                        disabled={!isEditing}
                        size={180}
                    />
                </div>

                <div className={styles["content-col"]}>
                    <div className={styles["header-wrapper"]}>
                        <ProfileHeader
                            name={`${formData.firstName} ${formData.lastName}`}
                            followers={`${profile?.followers ?? 0} seguidores`}
                            following={`${profile?.following ?? 0} seguindo`}
                            posts={`${profile?.posts ?? 0} posts`}
                        />
                        <div className={styles.actions}>
                            {isEditing ? (
                                <>
                                    <Button onClick={handleCancel} variant="ghost" disabled={saving}>Cancelar</Button>
                                    <Button onClick={handleSave} disabled={saving} variant="primary">
                                        {saving ? (
                                            <>
                                                <Spinner size={16} aria-hidden="true" />
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

                    {error && <p className={styles.error} role="alert">{error}</p>}

                    <ProfileDescription
                        title="Descrição"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        maxLength={255}
                    />

                    <div className={styles["form-wrapper"]}>
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
                        <ProfileInput
                            id="email"
                            name="email"
                            label="Email"
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
                            maxLength={30}
                            errorValidate={errorsValidate.username}
                            shakeKey={submitAttempt}
                        />
                    </div>

                    <p className={styles.hint}>
                        Pra trocar a senha, vá em <Link to="/settings">Configurações</Link>. Quer ver como os outros enxergam seu perfil? <Link to="/my-profile">Abrir meu perfil</Link>.
                    </p>
                </div>
            </div>
        </main>
    );
}
