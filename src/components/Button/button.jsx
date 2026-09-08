import './button.css'

export default function Button({ children, type = 'button', onClick }) {
  return (
    <button
      type={type}
      className="jello-button"
      onClick={onClick}
    >
      {children}
    </button>
  )
}