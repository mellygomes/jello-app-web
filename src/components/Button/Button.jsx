import buttonStyles from './button.module.css';
import authStyles from '../AuthLayout/auth-layout.module.css';

export default function Button({ children, type = 'button' }) {
    return (
        <div className={authStyles["auth-button-register"]}>
            <button type={type} className={buttonStyles["jello-button"]}>
                {children}
            </button>
        </div>
    )
}