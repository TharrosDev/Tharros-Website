import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-bg/80 border-b border-border">
      <Link href="/" aria-label="Tharros home">
        <Image
          src="/tharros-logo.svg"
          alt="Tharros"
          width={130}
          height={32}
          priority
        />
      </Link>
      <a
        href="mailto:magnus.abdelnour@gmail.com?subject=I%27d%20like%20to%20talk%20about%20an%20AI%20agent"
        className="px-5 py-2 rounded-full text-sm font-semibold bg-accent text-bg hover:brightness-110 transition-all duration-200"
      >
        Get in touch
      </a>
    </header>
  );
}
