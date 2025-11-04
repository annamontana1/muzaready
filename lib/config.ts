/**
 * Globální konfigurace aplikace
 */

/**
 * SKLAD_REŽIM - Přepínač pro kontrolu skladové dostupnosti
 *
 * OFF = Ignorovat sklad (aktuální stav pro on-demand výrobu)
 *       - Všechny kombinace jsou vždy vybratelné
 *       - Nezobrazuje se skladová dostupnost
 *       - Button není blokován nedostupností
 *
 * ON = Respektovat sklad (do budoucna)
 *      - Zobrazuje se štítek "Skladem / Na objednávku"
 *      - Kombinace nejsou blokovány, ale uživatel vidí dostupnost
 */
export const SKLAD_REZIM = false; // false = OFF, true = ON

/**
 * Konfigurace rozsahů pro konfigurátor
 */
export const CONFIGURATOR_RANGES = {
  LENGTH_MIN: 35,
  LENGTH_MAX: 90,
  LENGTH_STEP: 5,
  WEIGHT_MIN: 50,
  WEIGHT_MAX: 300,
  WEIGHT_STEP: 10,
} as const;

/**
 * Typy zakončení dostupné v konfigurátoru
 */
export const FINISHING_TYPES = [
  { code: 'raw', label: 'Surový cop', price_add: 0 },
  { code: 'keratin', label: 'Keratin', price_add: 2500 },
  { code: 'microkeratin', label: 'Mikrokeratin', price_add: 2800 },
  { code: 'nano_tapes', label: 'Tape-in (nano tapes)', price_add: 3000 },
  { code: 'vlasove_tresy', label: 'Vlasové tresy (hand-sewn wefts)', price_add: 3500 },
] as const;
