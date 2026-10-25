import styles from "./my-profile.module.css";
import {
    Button,
    ProfileCover,
    ProfileDescription,
    ProfileHeader,
    ProfileAvatar,
    Spinner
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
                <ProfileAvatar
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
                    title="Descrição"
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