import buttonStyles from "./button.module.css";

export default function Button({
    children,
    className = "",
    variant = "",
    size = "",
    color,
    hoverColor,
    textColor,
    ...props
}) {
    const classes = [
        buttonStyles["jello-button"],
        variant && buttonStyles[variant],
        size && buttonStyles[size],
    ].filter(Boolean).join(" ");

    return (
        <div className={className}>
            <button
                className={classes}
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
