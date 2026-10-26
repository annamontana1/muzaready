// Popis culíku podle toho, co si zákaznice nastavila: doporučená gramáž k délce,
// co znamená kategorie, druh vlasů, odstín a zvolené zakončení.
// Texty jsou návrh k doladění majitelkou.

const TIER_TEXT: Record<string, string> = {
  'Platinum Edition': 'Nejvyšší řada Múza: nejjemnější vlasy s maximálním leskem a hebkostí, vybírané kus po kusu.',
  Luxe: 'Prémiové vlasy pro každodenní nošení, hebké a s dlouhou životností.',
  'Baby Shades': 'Jemné světlé odstíny prodávané jako celý culík, tak jak je na fotce.',
};

const ENDING_TEXT: Record<string, string> = {
  NONE: 'Vlasy přijdou v copu, zakončení vám udělá vaše kadeřnice.',
  STANDARD_KERATIN: 'Keratinové spoje po pramíncích, nejpřirozenější vzhled a volnost v účesech.',
  MICRO_KERATIN: 'Drobné keratinové spoje, vhodné pro jemné a řidší vlasy.',
  PASKY_KERATINU: 'Keratin připravený v páscích, rychlejší aplikace.',
  WEFT: 'Vlasy našité na pásek (tresa), aplikace bez tepla.',
};

// Kolik gramů obvykle stačí na plné prodloužení v dané délce
export function recommendedGrams(cm: number): [number, number] {
  if (cm <= 45) return [100, 120];
  if (cm <= 60) return [100, 150];
  if (cm <= 75) return [150, 200];
  return [200, 250];
}

interface Props {
  lengthCm?: number | null;
  grams?: number | null;
  endingId: string;
  endingLabel: string;
  isDyed?: boolean;
  tierLabel?: string;
  shade?: string | number | null;
  shadeName?: string | null;
  structure?: string | null;
}

export default function PieceAbout({ lengthCm, grams, endingId, endingLabel, isDyed, tierLabel, shade, shadeName, structure }: Props) {
  const rows: { k: string; v: React.ReactNode }[] = [];

  if (lengthCm && grams) {
    const [lo, hi] = recommendedGrams(lengthCm);
    const verdict = grams < lo
      ? <>Zvolených <b className="font-semibold">{grams} g</b> stačí na zahuštění. Na plné prodloužení v délce {lengthCm} cm doporučujeme <b className="font-semibold">{lo}–{hi} g</b>.</>
      : grams <= hi
        ? <>Zvolených <b className="font-semibold">{grams} g</b> je akorát na plné prodloužení v délce {lengthCm} cm (doporučujeme {lo}–{hi} g).</>
        : <>Zvolených <b className="font-semibold">{grams} g</b> dá velmi hustý, bohatý objem. Na běžné plné prodloužení v délce {lengthCm} cm stačí {lo}–{hi} g.</>;
    rows.push({ k: 'Doporučená gramáž', v: verdict });
  }
  if (tierLabel && TIER_TEXT[tierLabel]) rows.push({ k: tierLabel, v: TIER_TEXT[tierLabel] });
  if (typeof isDyed === 'boolean') {
    rows.push({
      k: isDyed ? 'Středoevropské vlasy' : 'Panenské vlasy',
      v: isDyed
        ? 'Chovají se jako vaše vlastní: potřebují mytí, ošetřování a úpravu. Na korekci choďte po 2–3 měsících.'
        : 'Nebarvené vlasy v přirozeném stavu, bez chemického ošetření.',
    });
  }
  if (shade || shadeName) {
    rows.push({ k: `Odstín${shade ? ` ${shade}` : ''}`, v: [shadeName, structure].filter(Boolean).join(', ') || '—' });
  }
  if (ENDING_TEXT[endingId]) rows.push({ k: endingLabel, v: ENDING_TEXT[endingId] });

  if (!rows.length) return null;
  return (
    <section aria-labelledby="h-o-culiku">
      <h2 id="h-o-culiku" className="mb-1.5 font-cormorant text-[24px] leading-tight text-muza-ink">O vašem culíku</h2>
      <dl className="border-t border-muza-line">
        {rows.map((r) => (
          <div key={r.k} className="py-3 border-b border-muza-line">
            <dt className="text-sm font-normal text-[#45302F]">{r.k}</dt>
            <dd className="mt-1 text-[15px] leading-relaxed text-text-dark">{r.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
