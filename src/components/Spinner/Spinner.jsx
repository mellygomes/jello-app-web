import spinnerStyles from "./spinner.module.css";

export default function Spinner({
  size = 16,
  color = "#ffffff",
  thickness = 2,
  className = "",
  ...props
}) {
  return (
    <span
      className={`${spinnerStyles.spinner} ${className}`}
      style={{
        "--spinner-size": `${size}px`,
        "--spinner-color": color,
        "--spinner-thickness": `${thickness}px`,
      }}
      role="status"
      aria-label="Carregando"
      {...props}
    />
  );
}