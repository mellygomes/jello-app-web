import { useEffect, useState } from "react";
import { getAvatarUrl, getCoverUrl, getUserProfile } from "../services";
import { useUserPosts } from "./useUserPosts.js";
import { useFilter } from "./useFilter.js";

// const emptyForm = {
//     firstName: "",
//     lastName: "",
//     username: "",
//     bio: "",
//     email: "",
//     avatar: "",
//     cover: "",
//     posts: 0,
//     followers: 0,
//     following: 0,
// };

// function profileToForm(profile) {
//     return {
//         firstName: profile.firstName ?? "",
//         lastName: profile.lastName ?? "",
//         username: profile.username ?? "",
//         bio: profile.bio ?? "",
//         email: profile.email ?? "",
//         avatar: profile.avatar ?? "",
//         cover: profile.cover ?? "",
//         posts: profile.posts ?? 0,
//         followers: profile.followers ?? 0,
//         following: profile.following ?? 0,
//     }
// }

export function useUserProfile(userId) {

    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState(null);

    // const [profile, setProfile] = useState(null);
    // const [formData, setFormData] = useState(emptyForm);
    // const [avatarUrl, setAvatarUrl] = useState("");
    // const [coverUrl, setCoverUrl] = useState("");

    useEffect(() => {

        if (!userId) {
            setProfile(null);
            setProfileLoading(false);
            setProfileError(new Error("Identificador de usuário ausente."));
            return;
        }

        const controller = new AbortController();

        async function loadProfile() {
            setProfileLoading(true);
            setProfileError(null);

            // try {
            //     const response = await getUserProfile(userId);
            //     const userData = response.data;
            //
            //     setProfile(userData);
            //     setFormData(profileToForm(userData));
            //     setAvatarUrl(getAvatarUrl(userData.avatar?.id));
            //     setCoverUrl(getCoverUrl(userData.cover?.id));
            //
            // } catch (error) {
            //     console.log("Erro ao carregar perfil: ", error);
            // }

            try {
                const response = await getUserProfile(userId, {
                    signal: controller.signal,
                });

                setProfile(response.data);
            } catch (err) {
                if (!controller.signal.aborted) {
                    setProfile(null);
                    setProfileError(err);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setProfileLoading(false);
                }
            }
        }

        // fetchUser();
        loadProfile();

        return () => controller.abort();
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