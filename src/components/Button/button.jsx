import './button.css'

export default function Button({ children, type = 'button' }) {
  return (
    <button type={type} className="jello-button">
      {children}
    </button>
  )
}