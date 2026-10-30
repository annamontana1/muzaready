import Link from 'next/link';

// Pole „Získejte velkoobchodní slevu“: salony a kadeřnice se registrují, sleva se zapne po ověření
export default function WholesaleBand({ className = '' }: { className?: string }) {
  return (
    <section aria-labelledby="h-velkoobchod" className={`px-4 lg:px-8 ${className}`}>
      <div className="max-w-5xl mx-auto rounded-3xl bg-muza-ink text-muza-onink px-6 py-8 lg:px-12 lg:py-10 lg:flex lg:items-center lg:gap-10">
        <div className="flex-1">
          <h2 id="h-velkoobchod" className="font-cormorant text-[34px] lg:text-[42px] leading-[1.05]">
            Pro salony a kadeřnice: −10 % na všechny vlasy
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#EADCC8] max-w-xl">
            Prodlužujete vlasy profesionálně? Zaregistrujte svůj salon a nakupujte u nás trvale o 10 % levněji,
            na culíky i zakončení. Stačí odkaz na Instagram nebo Facebook salonu, slevu zapneme po krátkém ověření.
          </p>
        </div>
        <Link href="/velkoobchod?registrace=1"
          className="mt-6 lg:mt-0 inline-flex items-center justify-center h-[52px] px-7 rounded-full bg-[#F7F3EE] text-muza-ink text-sm font-medium whitespace-nowrap hover:bg-white transition-colors">
          Získat velkoobchodní slevu
        </Link>
      </div>
    </section>
  );
}
