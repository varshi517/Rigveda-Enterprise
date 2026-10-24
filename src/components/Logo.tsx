
export default function Logo({ className = "" }) {
  return (
    <a
      href="#home"
      className={`rigveda-logo ${className}`}
      aria-label="Rigveda Enterprises home"
    >
      <img
        src="/rigveda-logo.jpg"
        alt="Rigveda Enterprises"
      />
    </a>
  );
}
