import buttonStyles from "./button.module.css";

export default function Button({ children, className = "", ...props}) {
    return (
        <div className={className}>
            <button
                className={buttonStyles["jello-button"]}
                {...props}
            >
                {children}
            </button>
        </div>
    )
}