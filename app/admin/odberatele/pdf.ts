/**
 * PDF várky pro odběratele – vzniká v prohlížeči z toho, co je právě na
 * obrazovce (html2canvas → jsPDF), takže písmo i diakritika jsou stejné
 * jako v adminu.
 *
 * DŮLEŽITÉ: do PDF nikdy nesmí náklady ani marže. Typ PdfCulik proto pole
 * s nákladem vůbec nemá – volající ho sem nemůže poslat ani omylem.
 */
import { cenaCelkem, cenaKeratin, cenaVlasy, czDate, labelOf, pocetCuliku, slug, STAVY, TYPY_PLATBY, ZPUSOBY_PLATBY } from '@/lib/odberatele';

export interface PdfCulik {
  druh: string;
  barva: string;
  delkaCm: number;
  gramaz: number;
  cenaPerGram: number;
  keratinPerGram: number;
  stav: string;
  notes: string;
}

export interface PdfDluh {
  dluhZMinula: number;
  debtFrom: string;
  /** várky, které se počítají do dluhu (od data „počítat od“, bez vrácených culíků) */
  varky: Array<{ date: string; castka: number; tato: boolean }>;
  /** tato várka je starší než „počítat od“ – je už započtená v dluhu z minula */
  tatoVMinulem: boolean;
  platby: Array<{ date: string; amount: number; method: string; type: string }>;
  zbyva: number;
}

export interface PdfVarka {
  odberatel: string;
  keratinovy: boolean;
  datum: string;
  culiky: PdfCulik[];
  /** null = přehled dluhu se netiskne (odběratel nemá dluh, datum ani platby) */
  dluh: PdfDluh | null;
}

const RADKU_NA_STRANU = 16;
const BRAND = '#722F37';
const LINE = '#e7e5e4';
const MUTE = '#78716c';

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
const cislo = (n: number) => Math.round(n).toLocaleString('cs-CZ');
const kc = (n: number) => `${cislo(n)} Kč`;

function tabulka(v: PdfVarka, rows: PdfCulik[], offset: number, posledni: boolean): string {
  const k = v.keratinovy;
  const th = `padding:9px 8px;text-align:left;font-size:10px;letter-spacing:.05em;text-transform:uppercase;background:#292524;color:#fff;font-weight:600;`;
  const r = 'text-align:right;white-space:nowrap;';
  const head =
    `<tr><th style="${th}">#</th><th style="${th}">Vlasy</th><th style="${th}${r}">Délka</th><th style="${th}${r}">Gramáž</th>` +
    `<th style="${th}${r}">Cena/g${k ? ' + keratin.' : ''}</th>` +
    (k ? `<th style="${th}${r}">Vlasy</th><th style="${th}${r}">Keratinování</th>` : '') +
    `<th style="${th}${r}">${k ? 'Celkem' : 'Cena'}</th></tr>`;

  const body = rows
    .map((c, i) => {
      const vraceno = c.stav === 'vraceno';
      const td = `padding:10px 8px;border-top:1px solid ${LINE};vertical-align:top;background:${(offset + i) % 2 ? '#fbf7f7' : '#fff'};${
        vraceno ? 'color:#a8a29e;text-decoration:line-through;' : ''
      }`;
      const pod = [c.barva ? c.druh : '', vraceno ? labelOf(STAVY, c.stav) : '', c.notes].filter(Boolean).join(' · ');
      return (
        `<tr><td style="${td}">${offset + i + 1}</td>` +
        `<td style="${td}">${esc(c.barva || c.druh)}${pod ? `<div style="font-size:11px;color:${MUTE};text-decoration:none">${esc(pod)}</div>` : ''}</td>` +
        `<td style="${td}${r}">${c.delkaCm ? `${cislo(c.delkaCm)} cm` : '–'}</td>` +
        `<td style="${td}${r}">${cislo(c.gramaz)} g</td>` +
        `<td style="${td}${r}">${cislo(c.cenaPerGram)}${k && c.keratinPerGram ? ` + ${cislo(c.keratinPerGram)}` : ''} Kč/g</td>` +
        (k ? `<td style="${td}${r}">${kc(cenaVlasy(c))}</td><td style="${td}${r}">${kc(cenaKeratin(c))}</td>` : '') +
        `<td style="${td}${r}font-weight:700">${kc(cenaCelkem(c))}</td></tr>`
      );
    })
    .join('');

  let foot = '';
  if (posledni) {
    const f = `padding:11px 8px;background:#f7eeef;border-top:2px solid ${BRAND};font-weight:700;`;
    const all = v.culiky;
    foot =
      `<tfoot><tr><td style="${f}"></td><td style="${f}">Celkem ${pocetCuliku(all.length)}</td><td style="${f}"></td>` +
      `<td style="${f}${r}">${cislo(all.reduce((a, c) => a + c.gramaz, 0))} g</td><td style="${f}"></td>` +
      (k
        ? `<td style="${f}${r}">${kc(all.reduce((a, c) => a + cenaVlasy(c), 0))}</td><td style="${f}${r}">${kc(all.reduce((a, c) => a + cenaKeratin(c), 0))}</td>`
        : '') +
      `<td style="${f}${r}">${kc(all.reduce((a, c) => a + cenaCelkem(c), 0))}</td></tr></tfoot>`;
  }
  return `<table style="width:100%;border-collapse:collapse;border:1px solid ${LINE}"><thead>${head}</thead><tbody>${body}</tbody>${foot}</table>`;
}

function prehledDluhu(v: PdfVarka): string {
  const d = v.dluh;
  if (!d) return '';
  const td = `padding:9px 8px;border-top:1px solid ${LINE};`;
  const sub = `padding:10px 8px;border-top:1px solid #d6d3d1;background:#fafaf9;font-weight:600;`;
  const r = 'text-align:right;white-space:nowrap;';
  const radek = (popis: string, jak: string, castka: string, st = td) =>
    `<tr><td style="${st}">${popis}</td><td style="${st}">${jak}</td><td style="${st}${r}">${castka}</td></tr>`;

  const varky = [...d.varky].sort((a, b) => a.date.localeCompare(b.date));
  const platby = [...d.platby].sort((a, b) => a.date.localeCompare(b.date));
  const dluhCelkem = d.dluhZMinula + varky.reduce((a, x) => a + x.castka, 0);
  const zaplaceno = platby.reduce((a, p) => a + p.amount, 0);

  let rows = radek('Dluh z minula', d.debtFrom ? `před ${esc(czDate(d.debtFrom))}` : '', kc(d.dluhZMinula));
  rows += varky
    .map((x) => radek(`Várka ${esc(czDate(x.date))}`, x.tato ? 'tato várka' : '', kc(x.castka)))
    .join('');
  rows += radek('Dluh celkem', '', kc(dluhCelkem), sub);
  rows += platby
    .map((p) => {
      const jak = [p.type && p.type !== 'platba' ? labelOf(TYPY_PLATBY, p.type) : '', labelOf(ZPUSOBY_PLATBY, p.method)].filter(Boolean).join(', ');
      return radek(`Platba ${esc(czDate(p.date))}`, esc(jak), `− ${kc(p.amount)}`);
    })
    .join('');
  rows += radek('Zaplaceno celkem', platby.length === 0 ? 'zatím žádná platba' : '', `− ${kc(zaplaceno)}`, sub);

  const f = `padding:12px 8px;background:#f7eeef;border-top:2px solid ${BRAND};font-weight:700;font-size:16px;`;
  const poznamka = d.tatoVMinulem
    ? `<div style="font-size:12px;color:${MUTE};margin-top:8px">Várka z ${esc(czDate(v.datum))} je už započtená v dluhu z minula.</div>`
    : '';
  return (
    `<div style="font-size:18px;font-weight:600;margin:26px 0 8px">Přehled dluhu</div>` +
    `<table style="width:100%;border-collapse:collapse;border:1px solid ${LINE}"><tbody>${rows}</tbody>` +
    `<tfoot><tr><td style="${f}">Zbývá doplatit celkem</td><td style="${f}"></td><td style="${f}${r}">${kc(d.zbyva)}</td></tr></tfoot></table>` +
    poznamka
  );
}

/** HTML jednotlivých stran (exportováno kvůli testům: v HTML nesmí být náklad). */
export function sestavStrany(v: PdfVarka, vytvoreno: string): string[] {
  const chunks: PdfCulik[][] = [];
  for (let i = 0; i < v.culiky.length; i += RADKU_NA_STRANU) chunks.push(v.culiky.slice(i, i + RADKU_NA_STRANU));
  if (chunks.length === 0) chunks.push([]);

  const hlavicka =
    `<div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${BRAND};font-weight:600">Múza Hair Praha</div>` +
    `<div style="font-size:26px;font-weight:600;margin:4px 0 2px">Várka vlasů – ${esc(v.odberatel)}</div>` +
    `<div style="color:${MUTE};margin-bottom:18px">Předáno ${esc(czDate(v.datum))} · vytvořeno ${esc(vytvoreno)}</div>`;
  const paticka = (n: number) =>
    `<div style="margin-top:22px;font-size:11px;color:${MUTE};border-top:1px solid ${LINE};padding-top:10px;display:flex;justify-content:space-between">` +
    `<span>Múza Hair Praha · showroom Revoluční 8, Praha 1 · muzahair.cz</span>${chunks.length > 1 ? `<span>strana ${n} / ${chunks.length}</span>` : ''}</div>`;

  return chunks.map((rows, i) => {
    const posledni = i === chunks.length - 1;
    const zahlavi = i === 0 ? hlavicka : `<div style="color:${MUTE};margin-bottom:12px">Várka vlasů – ${esc(v.odberatel)} · ${esc(czDate(v.datum))} · pokračování</div>`;
    return zahlavi + tabulka(v, rows, i * RADKU_NA_STRANU, posledni) + (posledni ? prehledDluhu(v) : '') + paticka(i + 1);
  });
}

export async function stahniPdfVarky(v: PdfVarka): Promise<void> {
  const [{ default: html2canvas }, { default: JsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
  const strany = sestavStrany(v, new Date().toLocaleDateString('cs-CZ'));

  const doc = new JsPDF({ unit: 'mm', format: 'a4' });
  try {
    await document.fonts?.ready;
  } catch {
    /* písmo se načte i bez toho */
  }

  for (let i = 0; i < strany.length; i++) {
    const box = document.createElement('div');
    box.style.cssText =
      'position:fixed;left:-10000px;top:0;width:780px;padding:36px 34px;background:#fff;color:#292524;font-size:14px;line-height:1.4;box-sizing:border-box;';
    box.style.fontFamily = getComputedStyle(document.body).fontFamily;
    box.innerHTML = strany[i];
    document.body.appendChild(box);
    try {
      const canvas = await html2canvas(box, { scale: 2, backgroundColor: '#ffffff' });
      let w = 190;
      let h = (canvas.height * w) / canvas.width;
      if (h > 277) {
        w = (w * 277) / h;
        h = 277;
      }
      if (i > 0) doc.addPage();
      doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', (210 - w) / 2, 10, w, h);
    } finally {
      box.remove();
    }
  }

  doc.save(`Varka-${slug(v.odberatel)}-${v.datum || 'bez-data'}.pdf`);
}
