import { useEffect, useState } from "react";
import { getAvatarUrl, getCoverUrl, getUserProfile } from "../services";

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

export function useUserProfile(userId) {
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [coverUrl, setCoverUrl] = useState("");

    useEffect(() => {

        if (!userId) return;

        const fetchUser = async () => {
            try {
                const response = await getUserProfile(userId);
                const userData = response.data;

                setProfile(userData);
                setFormData(profileToForm(userData));
                setAvatarUrl(getAvatarUrl(userData.avatar?.id));
                setCoverUrl(getCoverUrl(userData.cover?.id));


            } catch (error) {
                console.log("Erro ao carregar perfil: ", error);
            }
        }

        fetchUser();
    }, [userId]);

    return {profile, formData, avatarUrl, coverUrl}
}