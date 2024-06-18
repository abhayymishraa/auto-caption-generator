import Link from "next/link";
import SparkleIcon from "./Sparkles";

export default function Header() {
  return (
    <header className="flex items-center  justify-between" >
    <Link href="/" className="flex gap-1" >
    <SparkleIcon />
      <span>
        Caption-Generator
      </span>
    </Link>
    <nav className="flex sm:gap-8 gap-3 text-white/80 text-sm sm:text-base ">
      <Link href="/">Home </Link>
      <Link href="/pricing">Pricing</Link>
      <a href="mailto:grabhaymishra@gmail.com" target="_blank" rel="noopener noreferrer">Contact</a>
    </nav>
  </header>
  )
}
