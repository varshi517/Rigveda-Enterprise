export default function StatusMessage({ type = 'info', children }) { return children ? <p className={`status-message status-${type}`} role="status" aria-live="polite">{children}</p> : null; }
