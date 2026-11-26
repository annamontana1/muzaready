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
  const sirky = k ? [4, 22, 9, 9, 16, 13, 13, 14] : [5, 40, 11, 12, 16, 16];
  const cols = `<colgroup>${sirky.map((w) => `<col style="width:${w}%">`).join('')}</colgroup>`;
  return `<table style="width:100%;table-layout:fixed;border-collapse:collapse;border:1px solid ${LINE}">${cols}<thead>${head}</thead><tbody>${body}</tbody>${foot}</table>`;
}

function prehledDluhu(d: PdfDluh | null, oznaceni: string, poznamkaText: string): string {
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
    .map((x) => radek(`Várka ${esc(czDate(x.date))}`, x.tato ? oznaceni : '', kc(x.castka)))
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
  const poznamka = poznamkaText ? `<div style="font-size:12px;color:${MUTE};margin-top:8px">${esc(poznamkaText)}</div>` : '';
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
    const pozn = v.dluh?.tatoVMinulem ? `Várka z ${czDate(v.datum)} je už započtená v dluhu z minula.` : '';
    return zahlavi + tabulka(v, rows, i * RADKU_NA_STRANU, posledni) + (posledni ? prehledDluhu(v.dluh, 'tato várka', pozn) : '') + paticka(i + 1);
  });
}

async function ulozStrany(strany: string[], soubor: string): Promise<void> {
  const [{ default: html2canvas }, { default: JsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);

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

  doc.save(soubor);
}

export async function stahniPdfVarky(v: PdfVarka): Promise<void> {
  await ulozStrany(sestavStrany(v, new Date().toLocaleDateString('cs-CZ')), `Varka-${slug(v.odberatel)}-${v.datum || 'bez-data'}.pdf`);
}

// ── Více várek v jednom PDF ────────────────────────────────────────────────

export interface PdfVyber {
  odberatel: string;
  keratinovy: boolean;
  varky: Array<{ datum: string; culiky: PdfCulik[] }>;
  /** null = přehled dluhu se netiskne */
  dluh: PdfDluh | null;
  /** data vybraných várek, které jsou starší než „počítat od“ (jsou už v dluhu z minula) */
  varkyVMinulem: string[];
}

// Kolik „řádků culíku“ se vejde na stranu A4 a kolik místa berou ostatní části
// (měřeno na vykreslené stránce: řádek ≈ 55 px, využitelná výška ≈ 925 px).
const KAPACITA = 16.5;
const REZIE_VARKY = 1.8; // nadpis várky + hlavička tabulky + mezera
const REZIE_SOUCET = 0.8; // řádek „Celkem N culíků“

function vycet(casti: string[]): string {
  if (casti.length <= 1) return casti.join('');
  return `${casti.slice(0, -1).join(', ')} a ${casti[casti.length - 1]}`;
}

/** HTML stran pro PDF z několika várek (exportováno kvůli testům). */
export function sestavStranyVyberu(v: PdfVyber, vytvoreno: string): string[] {
  const varky = [...v.varky].sort((a, b) => a.datum.localeCompare(b.datum));
  const strany: Array<{ html: string; pouzito: number }> = [{ html: '', pouzito: 0 }];
  const akt = () => strany[strany.length - 1];
  const nova = () => strany.push({ html: '', pouzito: 0 });

  for (const b of varky) {
    const pseudo: PdfVarka = { odberatel: v.odberatel, keratinovy: v.keratinovy, datum: b.datum, culiky: b.culiky, dluh: null };
    let offset = 0;
    // várku nedělit zbytečně: když se celá vejde na novou stranu, ale ne na zbytek téhle, začít novou stranu
    const cela = REZIE_VARKY + b.culiky.length + REZIE_SOUCET;
    if (akt().pouzito > 0 && akt().pouzito + cela > KAPACITA && cela <= KAPACITA) nova();
    do {
      if (akt().pouzito + REZIE_VARKY + 2 > KAPACITA) nova();
      const misto = Math.max(1, Math.floor(KAPACITA - akt().pouzito - REZIE_VARKY));
      const n = Math.min(b.culiky.length - offset, misto);
      const posledni = offset + n >= b.culiky.length;
      const nadpis = `<div style="font-size:17px;font-weight:600;margin:${akt().pouzito ? '22px' : '0'} 0 8px">Várka ${esc(czDate(b.datum))}${
        offset > 0 ? ` <span style="font-weight:400;color:${MUTE};font-size:13px">· pokračování</span>` : ''
      }</div>`;
      akt().html += nadpis + tabulka(pseudo, b.culiky.slice(offset, offset + n), offset, posledni);
      akt().pouzito += REZIE_VARKY + n + (posledni ? REZIE_SOUCET : 0);
      offset += n;
    } while (offset < b.culiky.length);
  }

  // součet za všechny vybrané várky
  const vse = varky.flatMap((b) => b.culiky);
  if (varky.length > 1) {
    if (akt().pouzito + 1.2 > KAPACITA) nova();
    const f = `padding:12px 8px;background:#292524;color:#fff;font-weight:700;`;
    akt().html +=
      `<table style="width:100%;border-collapse:collapse;margin-top:18px"><tr>` +
      `<td style="${f}">Celkem za ${varky.length === 2 ? '2 várky' : varky.length <= 4 ? `${varky.length} várky` : `${varky.length} várek`}</td>` +
      `<td style="${f}text-align:right;white-space:nowrap">${pocetCuliku(vse.length)}</td>` +
      `<td style="${f}text-align:right;white-space:nowrap">${cislo(vse.reduce((a, c) => a + c.gramaz, 0))} g</td>` +
      `<td style="${f}text-align:right;white-space:nowrap">${kc(vse.reduce((a, c) => a + cenaCelkem(c), 0))}</td></tr></table>`;
    akt().pouzito += 1.2;
  }

  if (v.dluh) {
    // řádky přehledu dluhu jsou nižší než řádky culíků (≈ 0,7)
    const potreba = 1.5 + 0.7 * (4 + v.dluh.varky.length + v.dluh.platby.length);
    if (akt().pouzito > 0 && akt().pouzito + potreba > KAPACITA) nova();
    const pozn =
      v.varkyVMinulem.length === 0
        ? ''
        : v.varkyVMinulem.length === 1
        ? `Várka z ${czDate(v.varkyVMinulem[0])} je už započtená v dluhu z minula.`
        : `Várky z ${vycet(v.varkyVMinulem.map((d) => czDate(d)))} jsou už započtené v dluhu z minula.`;
    akt().html += prehledDluhu(v.dluh, 'v tomto přehledu', pozn);
  }

  const data = varky.map((b) => czDate(b.datum));
  const popis = data.length <= 4 ? `Várky ${vycet(data)}` : `${data.length} várek od ${data[0]} do ${data[data.length - 1]}`;
  const hlavicka =
    `<div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${BRAND};font-weight:600">Múza Hair Praha</div>` +
    `<div style="font-size:26px;font-weight:600;margin:4px 0 2px">Várky vlasů – ${esc(v.odberatel)}</div>` +
    `<div style="color:${MUTE};margin-bottom:18px">${esc(popis)} · vytvořeno ${esc(vytvoreno)}</div>`;

  return strany.map((p, i) => {
    const zahlavi = i === 0 ? hlavicka : `<div style="color:${MUTE};margin-bottom:12px">Várky vlasů – ${esc(v.odberatel)} · pokračování</div>`;
    const paticka =
      `<div style="margin-top:22px;font-size:11px;color:${MUTE};border-top:1px solid ${LINE};padding-top:10px;display:flex;justify-content:space-between">` +
      `<span>Múza Hair Praha · showroom Revoluční 8, Praha 1 · muzahair.cz</span>${strany.length > 1 ? `<span>strana ${i + 1} / ${strany.length}</span>` : ''}</div>`;
    return zahlavi + p.html + paticka;
  });
}

export async function stahniPdfVyberu(v: PdfVyber): Promise<void> {
  const data = v.varky.map((b) => b.datum).sort();
  const rozsah = data.length ? `${data[0]}_${data[data.length - 1]}` : 'bez-data';
  await ulozStrany(sestavStranyVyberu(v, new Date().toLocaleDateString('cs-CZ')), `Varky-${slug(v.odberatel)}-${rozsah}.pdf`);
}
