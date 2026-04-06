import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Recenze zákazníků - Mùza Hair Praha',
  description: 'Přečtěte si recenze našich spokojených zákazníků. Reálné zkušenosti s prodlouženými vlasy od Mùza Hair.',
};

const reviews = [
  {
    text: 'LUXE kvalita je naprosto skvělá! Vlasy vypadají úžasně přirozeně a jsou neuvěřitelně hebké. Určitě budu objednávat znovu.',
    author: 'Karolína P.',
    location: 'Praha',
  },
  {
    text: 'Objednala jsem si Platinum edition a jsem nadšená! Kvalita je perfektní, vlasy vydrží dlouho a stále vypadají skvěle.',
    author: 'Michaela Š.',
    location: 'Brno',
  },
  {
    text: 'Skvělý poměr ceny a kvality! Standard kvalita je úplně dostačující a vlasy vypadají krásně. Rychlé doručení, profesionální přístup.',
    author: 'Petra M.',
    location: 'Ostrava',
  },
];

const stats = [
  { value: '4.9', label: 'Průměrné hodnocení' },
  { value: '500+', label: 'Spokojených zákaznic' },
  { value: '98%', label: 'Míra spokojenosti' },
  { value: '8+', label: 'Let na trhu' },
];

export default function RecenzePage() {
  return (
    <div style={{ background: 'var(--white)' }}>

      {/* Header section */}
      <section className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
        <div
          className="text-[11px] tracking-[0.15em] uppercase font-light mb-10"
          style={{ color: 'var(--text-soft)' }}
        >
          <Link href="/" className="hover:underline" style={{ color: 'var(--text-soft)' }}>Domů</Link>
          {' — '}
          <span style={{ color: 'var(--text-mid)' }}>Recenze</span>
        </div>

        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          RECENZE ZÁKAZNÍKŮ
        </div>

        <h1
          className="font-cormorant text-[clamp(40px,5vw,60px)] font-light leading-[1.12] tracking-[-0.01em] mb-6"
          style={{ color: 'var(--text-dark)' }}
        >
          Co říkají naše zákaznice
        </h1>

        <p
          className="text-[15px] leading-[1.8] font-light max-w-[520px]"
          style={{ color: 'var(--text-soft)' }}
        >
          Přečtěte si recenze našich spokojených zákazníků. Jejich reálné zkušenosti
          s našimi produkty a službami.
        </p>
      </section>

      {/* Stats bar */}
      <section className="px-8 lg:px-20 py-12" style={{ background: 'var(--beige)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="py-6 pr-8 border-b md:border-b-0 md:border-r last:border-r-0"
              style={{ borderColor: 'var(--border-light)' }}
            >
              <div
                className="font-cormorant text-[clamp(28px,3vw,40px)] font-light leading-none mb-2"
                style={{ color: 'var(--burgundy)' }}
              >
                {stat.value}
              </div>
              <div
                className="text-[12px] tracking-[0.05em] uppercase font-light"
                style={{ color: 'var(--text-soft)' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews list */}
      <section style={{ background: 'var(--ivory-warm)' }}>
        {reviews.map((review, index) => (
          <div
            key={index}
            className="px-8 lg:px-20 py-12 border-b"
            style={{ borderColor: 'var(--border-light)' }}
          >
            <div
              className="text-[16px] mb-4 tracking-wide"
              style={{ color: 'var(--burgundy)' }}
            >
              {'★'.repeat(5)}
            </div>
            <p
              className="text-[15px] leading-[1.8] font-light italic mb-6 max-w-[640px]"
              style={{ color: 'var(--text-soft)' }}
            >
              &ldquo;{review.text}&rdquo;
            </p>
            <div
              className="text-[11px] tracking-[0.18em] uppercase font-light"
              style={{ color: 'var(--text-mid)' }}
            >
              {review.author} — {review.location}
            </div>
          </div>
        ))}
      </section>

      {/* CTA section */}
      <section className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
        <div className="w-12 h-px mb-8" style={{ background: 'var(--accent)' }} />
        <h2
          className="font-cormorant text-[clamp(26px,3vw,38px)] font-light mb-4"
          style={{ color: 'var(--text-dark)' }}
        >
          Přidejte se k naším zákaznicím
        </h2>
        <p
          className="text-[15px] leading-[1.8] font-light mb-8 max-w-[440px]"
          style={{ color: 'var(--text-soft)' }}
        >
          Prohlédněte si naši kolekci a vyberte si vlasy, které vám budou perfektně slušet.
        </p>
        <div className="flex gap-6 flex-wrap items-center">
          <Link
            href="/vlasy-k-prodlouzeni"
            className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px inline-block"
            style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
          >
            Prozkoumat kolekci
          </Link>
          <Link
            href="/showroom"
            className="text-[12px] tracking-[0.1em] uppercase font-light"
            style={{ color: 'var(--text-mid)' }}
          >
            Navštívit showroom →
          </Link>
        </div>
      </section>

    </div>
  );
}
