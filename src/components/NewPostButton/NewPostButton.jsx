import { useNavigate, useLocation } from 'react-router-dom';
import styles from './NewPostButton.module.css'; 

const NewPostButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <button
            className={styles.newPostButton}
            onClick={() =>
                navigate('/new-post', {
                    state: { backgroundLocation: location },
                })
            }
        >
            Criar Post
        </button>
    );
};

export default NewPostButton;