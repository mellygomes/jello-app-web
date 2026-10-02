import buttonStyles from "./button.module.css";

export default function Button({
    children, 
    className = "", 
    variant = "",
    color,
    hoverColor,
    textColor,
    ...props
}) {
    return (
        <div className={className}>
            <button
                className={`${buttonStyles["jello-button"]} ${variant ? buttonStyles[variant] : ""}`}
                style={{
                    ...(color && { "--btn-bg": color }),
                    ...(hoverColor && { "--btn-bg-hover": hoverColor }),
                    ...(textColor && { "--btn-text": textColor }),
                }}
                
                {...props}
            >
                {children}
            </button>
        </div>
    )
}