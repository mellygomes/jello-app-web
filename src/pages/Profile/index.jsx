import styles from "./profile.module.css";
import profilePic from "../../assets/profile-picture.png";
import coverPicture from "../../assets/cover.png";

import { ProfilePic, ProfileCover, ProfileHeader, ProfileDescription, ProfileInput, Button } from "../../components";

export default function Profile() {
    return (
        <main className={styles["page-wrapper"]}>

            <div className={styles["profile-container"]}>

                <ProfileCover src={coverPicture} />
                <ProfilePic src={profilePic} />

            </div>

            <div className={`${styles["info-container"]} container-lg`}>
                <div className={styles["header-wrapper"]}>
                    <ProfileHeader
                        name="Fernando Souza"
                        followers="191 seguidores"
                        following="82 seguindo"
                        posts="12 posts"
                    />
                    <Button>Editar</Button>
                </div>

                <ProfileDescription bio="Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
                    took a galley of type and scrambled it to make a type specimen book. It has survived not only five
                    centuries, but also the leap into electronic typesetting, remaining essentially unchanged" />

                <div className={`container ${styles["form-wrapper"]}`}>
                      <div className={styles["input-wrapper"]}>
                          <ProfileInput id={"name"} label={"Nome"} />
                          <ProfileInput id={"username"} label={"Nome de usuário"} />
                      </div>
                      <div className={styles["input-wrapper"]}>
                          <ProfileInput id={"email"} label={"E-mail"} type={"email"} />
                          <ProfileInput id={"password"} label={"Senha"} type={"password"} />
                      </div>
                </div>
            </div>

        </main>
    );
}