import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Náš příběh | Múza Hair Praha',
  description: 'Více než 8 let pomáháme ženám cítit se krásně. Česká rodinná firma s vlastní barvírnou a showroomem v Praze.',
  alternates: { canonical: 'https://muzahair.cz/informace/nas-pribeh' },
};

const timeline = [
  {
    year: '2016',
    title: 'Začátek příběhu',
    description: 'Anna založila Mùza Hair s vizí přinést na český trh kvalitní vlasy k prodloužení za férové ceny.',
  },
  {
    year: '2018',
    title: 'Vlastní barvírna',
    description: 'Otevřeli jsme vlastní barvírnu v Praze, abychom měli plnou kontrolu nad kvalitou barvených vlasů.',
  },
  {
    year: '2020',
    title: 'Showroom Praha',
    description: 'Otevřeli jsme první showroom v centru Prahy, kde si zákaznice mohou prohlédnout vlasy naživo.',
  },
  {
    year: '2022',
    title: 'Platinum Edition',
    description: 'Uvedli jsme prémiovou řadu Platinum Edition - ready-to-wear kusy nejvyšší kvality.',
  },
  {
    year: '2024',
    title: 'Nový e-shop',
    description: 'Spustili jsme moderní e-shop s konfigurátorem vlasů a online poradenstvím.',
  },
];

const values = [
  {
    title: 'Kvalita na prvním místě',
    description: 'Používáme pouze 100% pravé lidské vlasy nejvyšší kvality. Každý kus prochází důkladnou kontrolou.',
  },
  {
    title: 'Férovost a transparentnost',
    description: 'Jasné ceny bez skrytých poplatků. Upřímně poradíme, i když to znamená doporučit levnější variantu.',
  },
  {
    title: 'Osobní přístup',
    description: 'Každá zákaznice je pro nás jedinečná. Rádi poradíme s výběrem odstínu i gramáže.',
  },
  {
    title: 'Etický původ',
    description: 'Naše vlasy pocházejí z etických zdrojů. Spolupracujeme pouze s ověřenými dodavateli.',
  },
];

export default function NasPribehPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm mb-8 flex gap-2" style={{ color: 'var(--text-soft)' }}>
            <Link href="/" className="hover:opacity-70 transition">Domů</Link>
            <span>/</span>
            <Link href="/informace" className="hover:opacity-70 transition">Informace</Link>
            <span>/</span>
            <span style={{ color: 'var(--burgundy)' }}>Náš příběh</span>
          </nav>

          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">O nás</span>
          </div>

          <h1 className="font-cormorant text-[clamp(28px,4vw,52px)] font-light leading-tight mb-8" style={{ color: 'var(--text-dark)' }}>
            Náš příběh
          </h1>

          <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--text-soft)' }}>
            Již více než 8 let pomáháme ženám cítit se krásně a sebevědomě. Jsme česká rodinná firma s vášní pro kvalitní vlasy.
          </p>

          <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.5rem' }}>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-dark)' }}>
              <strong>Mùza Hair</strong> vznikla z jednoduché myšlenky: každá žena si zaslouží mít vlasy svých snů, aniž by musela utratit celé jmění.
            </p>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-soft)' }}>
              Když Anna v roce 2016 hledala kvalitní vlasy k prodloužení, narazila na dva extrémy — buď nekvalitní syntetické vlasy za pár stovek, nebo luxusní salony s cenami v desítkách tisíc. Rozhodla se to změnit.
            </p>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-soft)' }}>
              Začala navazovat kontakty s dodavateli po celém světě, testovat desítky vzorků a hledat tu správnou rovnováhu mezi kvalitou a cenou. Po měsících práce se zrodila Mùza Hair.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--text-soft)' }}>
              Dnes máme <strong style={{ color: 'var(--text-dark)' }}>vlastní barvírnu v Praze</strong>, kde pečlivě barvíme panenské vlasy do všech odstínů blond. Máme <strong style={{ color: 'var(--text-dark)' }}>showroom v centru Prahy</strong>, kde si můžete prohlédnout vlasy naživo. A máme <strong style={{ color: 'var(--text-dark)' }}>tisíce spokojených zákaznic</strong> po celé České republice.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Historie</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
            Naše cesta
          </h2>

          <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
            {timeline.map((item) => (
              <div key={item.year} className="flex items-start gap-8 py-6 border-b" style={{ borderColor: 'var(--ivory)' }}>
                <div className="flex-shrink-0 w-16">
                  <span
                    className="font-cormorant text-2xl font-light"
                    style={{ color: 'var(--burgundy)' }}
                  >
                    {item.year}
                  </span>
                </div>
                <div>
                  <h3 className="font-cormorant text-xl font-light mb-1" style={{ color: 'var(--text-dark)' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hodnoty */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Hodnoty</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
            Naše hodnoty
          </h2>

          <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
            {values.map((value) => (
              <div key={value.title} className="py-6 border-b" style={{ borderColor: 'var(--beige)' }}>
                <h3 className="font-cormorant text-xl font-light mb-2" style={{ color: 'var(--text-dark)' }}>{value.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tým */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Zakladatelka</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
            Kdo za Mùza Hair stojí
          </h2>

          <div className="border-t pt-8" style={{ borderColor: 'var(--text-dark)' }}>
            <div className="flex items-start gap-8">
              <div>
                <h3 className="font-cormorant text-2xl font-light mb-1" style={{ color: 'var(--text-dark)' }}>Anna</h3>
                <p className="text-[11px] tracking-[0.2em] uppercase mb-4 font-normal" style={{ color: 'var(--accent)' }}>Zakladatelka & CEO</p>
                <p className="text-sm leading-relaxed italic" style={{ color: 'var(--text-soft)' }}>
                  "Věřím, že krásné vlasy nejsou luxus jen pro vyvolené. Každá žena si zaslouží cítit se výjimečně, a my jsme tu od toho, abychom jí v tom pomohli."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Kontakt</span>
          </div>
          <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
            {[
              { label: 'Showroom Praha', value: 'Centrum Prahy (přesná adresa po domluvě)' },
              { label: 'Telefon', value: '+420 728 722 880' },
              { label: 'Email', value: 'info@muzahair.cz' },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-8 py-5 border-b" style={{ borderColor: 'var(--beige)' }}>
                <div className="w-40 flex-shrink-0 text-[11px] tracking-[0.15em] uppercase font-normal" style={{ color: 'var(--text-soft)' }}>
                  {c.label}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-dark)' }}>{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--burgundy)' }} className="px-8 lg:px-20 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <span className="block w-8 h-px" style={{ background: 'rgba(255,255,255,0.4)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Staňte se součástí příběhu</span>
            <span className="block w-8 h-px" style={{ background: 'rgba(255,255,255,0.4)' }} />
          </div>
          <h2 className="font-cormorant text-[clamp(24px,3vw,40px)] font-light mb-4" style={{ color: 'var(--ivory)' }}>
            Navštivte náš showroom nebo si prohlédněte katalog online
          </h2>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link
              href="/katalog"
              className="inline-block px-8 py-3 text-sm font-medium rounded-sm transition hover:opacity-90"
              style={{ background: 'var(--ivory)', color: 'var(--burgundy)' }}
            >
              Prohlédnout katalog
            </Link>
            <Link
              href="/kontakt"
              className="inline-block border px-8 py-3 text-sm font-medium rounded-sm transition hover:opacity-90"
              style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'var(--ivory)' }}
            >
              Navštívit showroom
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
