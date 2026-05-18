import './Button.css';

export function Button({ label, onClick, variant = 'primary', className = '', style = {} }) {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      style={style}
    >
      {label}
    </button>
  );
}
