import styles from "./user-profile.module.css";
import {
    Button,
    Filter,
    ProfileCover,
    ProfileDescription,
    ProfileHeader,
    ProfilePic,
    Spinner
} from "../../components/index.js";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostList from "../../components/PostCard/PostList.jsx";
import { useUserPosts } from "../../hooks/useUserPosts.js";
import { Pagination } from "antd";
import { useFilter } from "../../hooks/useFilter.js";
import { useUserProfile } from "../../hooks/useUserProfile.js";
import { IdcardOutlined, LeftOutlined } from "@ant-design/icons";

export default function UserProfile() {

    const navigate = useNavigate();
    const {userId} = useParams();

    const pageSize = 5;
    const [page, setPage] = useState(1);

    const {setField, reset, draft, applied, apply} = useFilter();
    const {posts, total, loading: loadingPosts, error} = useUserPosts(userId, page, pageSize, applied);
    const {profile, formData, avatarUrl, coverUrl} = useUserProfile(userId);

    if (error) return <p>Erro dog</p>;

    return (
        <div className={styles.container}>
            <div className={styles.user}>
                <div className={styles.images}>
                    <LeftOutlined
                        style={{ fontSize: "36px", cursor: "pointer", position: "absolute", left: "14px", top: "14px" }}
                        onClick={() => navigate("/")}
                    />
                    <ProfileCover
                        className={styles.cover}
                        src={coverUrl}
                        disabled={true}
                    />
                    <ProfilePic
                        className={styles.avatar}
                        src={avatarUrl}
                        disabled={true}
                    />
                </div>

                <div className={styles.info}>
                    <ProfileHeader
                        className={styles.header}
                        name={`${formData.firstName} ${formData.lastName}`}
                        followers={`${profile?.followers ?? 0} seguidores`}
                        following={`${profile?.following ?? 0} seguindo`}
                        posts={`${profile?.posts ?? 0} posts`}
                    />

                    <Button className={styles.portfolio}>
                        <IdcardOutlined style={{ fontSize: "24px" }} />
                        <span>Acessar Portfólio</span>
                    </Button>

                    <ProfileDescription
                        title="SOBRE"
                        value={formData.bio}
                        maxLength={255}
                        disabled={true}
                    />
                </div>
            </div>

            <div className={styles.posts}>
                <div className={styles.postsScroll}>
                    <Filter
                        isIconDisplay={true}
                        filter={draft}
                        onChange={setField}
                        onReset={reset}
                        onSearch={() => {
                            apply();
                            setPage(1);
                        }}
                    />

                    { loadingPosts ? <Spinner /> : <PostList posts={posts}/> }

                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={total}
                        onChange={(newPage) => setPage(newPage)}
                        showSizeChanger={false}
                    />
                </div>

            </div>
        </div>
    );
}