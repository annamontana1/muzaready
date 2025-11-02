import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-burgundy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Column 1: O nás */}
          <div>
            <h3 className="font-playfair text-xl mb-4">O nás</h3>
            <ul className="space-y-2 text-sm text-ivory">
              <li>
                <Link href="/o-nas" className="hover:text-white transition">
                  Náš příběh
                </Link>
              </li>
              <li>
                <Link href="/informace/nas-pribeh" className="hover:text-white transition">
                  8 let na trhu
                </Link>
              </li>
              <li>
                <Link href="/vykup-vlasu-pro-nemocne" className="hover:text-white transition">
                  Výkup vlasů pro nemocné
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Zákaznický servis */}
          <div>
            <h3 className="font-playfair text-xl mb-4">Zákaznický servis</h3>
            <ul className="space-y-2 text-sm text-ivory">
              <li>
                <Link href="/informace/jak-nakupovat" className="hover:text-white transition">
                  Jak nakupovat
                </Link>
              </li>
              <li>
                <Link href="/informace/odeslani-a-stav-objednavky" className="hover:text-white transition">
                  Odeslání a stav objednávky
                </Link>
              </li>
              <li>
                <Link href="/informace/platba-a-vraceni" className="hover:text-white transition">
                  Platba a vrácení
                </Link>
              </li>
              <li>
                <Link href="/informace/faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Produkty */}
          <div>
            <h3 className="font-playfair text-xl mb-4">Produkty</h3>
            <ul className="space-y-2 text-sm text-ivory">
              <li>
                <Link href="/vlasy-k-prodlouzeni/nebarvene-panenske" className="hover:text-white transition">
                  Nebarvené panenské vlasy
                </Link>
              </li>
              <li>
                <Link href="/vlasy-k-prodlouzeni/barvene-blond" className="hover:text-white transition">
                  Barvené blond vlasy
                </Link>
              </li>
              <li>
                <Link href="/vlasy-k-prodlouzeni/vlasy-na-keratin" className="hover:text-white transition">
                  Vlasy na keratin
                </Link>
              </li>
              <li>
                <Link href="/cenik" className="hover:text-white transition">
                  Ceník
                </Link>
              </li>
              <li>
                <Link href="/velkoobchod" className="hover:text-white transition">
                  Velkoobchod
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="font-playfair text-xl mb-4">Newsletter</h3>
            <p className="text-sm text-ivory mb-4">
              Získejte slevu 10% na první nákup
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Váš email"
                className="px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white"
              />
              <button className="btn-primary">
                Odebírat
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-ivory">
          <p>© 2025 Mùza Hair Shop | Praha, Česká republika</p>
          <div className="flex gap-4">
            <Link href="/informace/obchodni-podminky" className="hover:text-white transition">
              Obchodní podmínky
            </Link>
            <span>|</span>
            <Link href="/informace/ochrana-soukromi" className="hover:text-white transition">
              Ochrana soukromí
            </Link>
          </div>
          <div className="flex gap-4 text-xl">
            <a
              href="https://www.instagram.com/muzahair.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
              aria-label="Instagram"
            >
              📷
            </a>
            <a
              href="https://www.facebook.com/muzahair"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
              aria-label="Facebook"
            >
              📘
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
