import { useEffect, useState } from 'react';
import styles from './side-bar.module.css';
import iconHome from '../../../../assets/icons/icon-home.png';
import iconMenu from '../../../../assets/icons/icon-menu.png';
import iconFriends from '../../../../assets/icons/icon-friends.png';
import iconProfile from '../../../../assets/icons/icon-user-30.png';
import iconSettings from '../../../../assets/icons/icon-settings.png';
import iconExplore from '../../../../assets/icons/icon-explorer.png';
import iconUser from '../../../../assets/icons/icon-user-30.png';
import iconCat from '../../../../assets/icons/gatinho.jpeg';
import iconFollow from '../../../../assets/icons/icon-follow.png';
import Button from '../../../../components/Button/Button';
import { useAuth } from '../../../../contexts/auth/useAuth.js';
import { getAvatarUrl, getCurrentProfile } from '../../../../services/feed.js';

export default function SideBar() {
    const { user, loading: authLoading } = useAuth();
    const [isOpen, setIsOpen] = useState(true);
    const [profile, setProfile] = useState(null);
    const [profileError, setProfileError] = useState('');
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        if (authLoading) return undefined;

        if (!user) {
            setLoadingProfile(false);
            return undefined;
        }

        let cancelled = false;

        async function loadProfile() {
            setLoadingProfile(true);
            setProfileError('');

            try {
                const response = await getCurrentProfile();
                if (!response.data) {
                    throw new Error('A resposta não contém os dados do perfil');
                }
                if (!cancelled) setProfile(response.data);
            } catch (error) {
                console.error('Erro ao carregar o perfil do usuário:', error);
                if (!cancelled) setProfileError('Não foi possível carregar o perfil.');
            } finally {
                if (!cancelled) setLoadingProfile(false);
            }
        }

        loadProfile();
        return () => {
            cancelled = true;
        };
    }, [user, authLoading]);

    const displayedUser = profile ?? user;
    const name = [displayedUser?.firstName, displayedUser?.lastName] || 'Usuário';
    const avatar = displayedUser?.avatar;
    const avatarUrl = avatar?.url || getAvatarUrl(avatar?.id) || iconUser;

    return (
        <div className={isOpen ? styles.sideBarOpen : styles.sideBarClosed}>
            <button
                className={styles['menu-icon']}
                onClick={() => setIsOpen((open) => !open)}
                aria-label={isOpen ? 'Recolher menu' : 'Expandir menu'}
                aria-expanded={isOpen}
            >
                <img src={iconMenu} alt="" />
            </button>

            {isOpen && (
                <div>
                    <div className={styles.profile}>
                        <img
                            src={avatarUrl}
                            alt={`Foto de perfil de ${name}`}
                            className={styles['profile-pic']}
                        />
                        <p>{loadingProfile ? 'Carregando perfil...' : name}</p>
                        {profileError && (
                            <p className={styles['profile-error']}>
                                {profileError}
                            </p>
                        )}
                        <Button className={styles['explore-icon']}>
                            <img src={iconExplore} alt="" />
                            Explorar
                        </Button>
                    </div>

                    <div className={styles['pages-links']}>
                        <button className={styles['pages-buttons']}>
                            <img src={iconHome} alt="" />
                            <span>Início</span>
                        </button>
                        <button className={styles['pages-buttons']}>
                            <img src={iconFriends} alt="" />
                            <span>Amigos</span>
                        </button>
                        <button className={styles['pages-buttons']}>
                            <img src={iconProfile} alt="" />
                            <span>Seu perfil</span>
                        </button>
                        <button className={styles['pages-buttons']}>
                            <img src={iconSettings} alt="" />
                            <span>Configurações</span>
                        </button>
                    </div>

                    <div className={styles.suggestions}>
                        <p>Sugestões</p>
                        <div className={styles['profiles-suggestion']}>
                            <img src={iconCat} alt="" />
                            <p>Gatinha linda demais</p>
                            <Button>
                                Seguir
                                <img src={iconFollow} alt="" />
                            </Button>
                        </div>
                        <div className={styles['profiles-suggestion']}>
                            <img src={iconCat} alt="" />
                            <p>Gatinho 2</p>
                            <Button variant="ghost">Seguindo</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
