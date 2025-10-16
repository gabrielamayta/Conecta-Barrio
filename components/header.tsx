import Link from "next/link"

export function Header() {
  return (
    <header className="bg-[#8FCDD6] py-8 text-center border-b-2 border-[#7AB8C4]">
      <Link href="/">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-2">Conecta Barrio</h1>
        <p className="font-serif text-lg md:text-xl text-gray-800">Encuentra lo que necesitas, cerca tuyo</p>
      </Link>
    </header>
  )
}
