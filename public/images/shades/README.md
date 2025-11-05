# Fotografie odstínů vlasů

Tato složka obsahuje fotografie modelek pro jednotlivé odstíny vlasů.

## Formát názvů souborů

Soubory musí být pojmenovány podle následujícího vzoru:
```
[číslo odstínu]-[název].jpg
```

### Příklady názvů souborů:

- `01-černá.jpg` - Odstín #1 (Černá)
- `02-tmavě-hnědá.jpg` - Odstín #2 (Tmavě hnědá)
- `03-hnědá.jpg` - Odstín #3 (Hnědá)
- `04-světle-hnědá.jpg` - Odstín #4 (Světle hnědá)
- `05-tmavě-blond.jpg` - Odstín #5 (Tmavě blond)
- `06-střední-blond.jpg` - Odstín #6 (Střední blond)
- `07-blond.jpg` - Odstín #7 (Blond)
- `08-světle-blond.jpg` - Odstín #8 (Světle blond)
- `09-velmi-světlá-blond.jpg` - Odstín #9 (Velmi světlá blond)
- `10-platinová-blond.jpg` - Odstín #10 (Platinová blond)

## Požadavky na fotografie

### Rozměry a poměr stran
- **Doporučené rozměry**: 600×800 px (originál)
- **Poměr stran**: 3:4 (vertikální)
- **Zobrazovaná velikost**: 90×120 px (miniatura)

### Styl fotografie
- **Pozadí**: Jemná béžová (#e8e1d7) nebo neutrální barva
- **Póza**: Podobná póza pro všechny fotky (konzistence)
- **Osvětlení**: Jednotné, profesionální světlo
- **Fokus**: Důraz na barvu a texturu vlasů

### Kvalita
- **Formát**: JPG (optimalizovaný pro web)
- **Kvalita**: 80-90% (komprese)
- **Velikost souboru**: Cca 50-150 KB po optimalizaci

## Příklad správné fotografie

Viz přiložená ukázková fotografie - modelka s dlouhými černými vlasy, jemné béžové pozadí, elegantní póza, důraz na lesk a texturu vlasů.

## Fallback

Pokud fotografie neexistuje nebo se nepodaří načíst, systém automaticky zobrazí barevný gradient odpovídající odstínu.

## Technické detaily

Fotografie jsou načítány pomocí Next.js Image komponenty s následujícími optimalizacemi:
- Lazy loading
- Automatická optimalizace velikosti
- WebP konverze (pokud je podporována)
- Responsive loading
