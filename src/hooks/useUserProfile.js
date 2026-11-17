import { useEffect, useState } from "react";
import { getAvatarUrl, getCoverUrl, getUserProfile } from "../services";

export function useUserProfile(userId) {

    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState(null);

    useEffect(() => {

        if (!userId) {
            setProfile(null);
            setProfileLoading(false);
            setProfileError(new Error("Identificador de usuário ausente."));
            return;
        }

        async function loadProfile() {
            setProfileLoading(true);
            setProfileError(null);

            try {
                const response = await getUserProfile(userId);
                const userData = response.data;
                setProfile(userData);
            } catch (err) {
                setProfile(null);
                setProfileError(err);
            } finally {
                setProfileLoading(false);
            }
        }

        // fetchUser();
        loadProfile();
    }, [userId]);

    const avatarUrl = getAvatarUrl(profile?.avatar?.id);
    const coverUrl = getCoverUrl(profile?.cover?.id);

    return {
        profile,
        profileLoading,
        profileError,
        avatarUrl,
        coverUrl,
    }
}