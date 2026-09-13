import buttonStyles from './Button.module.css';
import authStyles from '../AuthLayout/AuthLayout.module.css';

export default function Button({children, type = 'button'}) {
    return (
        <div className={authStyles["auth-button-register"]}>
            <button type={type} className={buttonStyles["jello-button"]}>
                {children}
            </button>
        </div>
    )
}