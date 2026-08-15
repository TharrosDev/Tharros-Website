type IconProps = { className?: string };

const base = "h-[18px] w-[18px]";

export function SearchIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <circle cx="8.75" cy="8.75" r="5.75" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13 13L17.5 17.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function BagIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M3.5 5.75h13l-1 11.5h-11l-1-11.5Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7.25 8V5a2.75 2.75 0 0 1 5.5 0v3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function AccountIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <circle cx="10" cy="7" r="3.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.75 17c0-3.2 2.8-5.25 6.25-5.25S16.25 13.8 16.25 17" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function HeartIcon({ className = "", filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      aria-hidden="true"
      className={`${base} ${className}`}
    >
      <path
        d="M10 16.5S3.25 12.6 3.25 8.06A3.31 3.31 0 0 1 10 6.3a3.31 3.31 0 0 1 6.75 1.76c0 4.54-6.75 8.44-6.75 8.44Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function MenuIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M2.5 6h15M2.5 14h15" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function PlusIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M10 3.5v13M3.5 10h13" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function MinusIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M3.5 10h13" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
