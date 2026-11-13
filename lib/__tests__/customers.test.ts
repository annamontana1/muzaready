import { describe, expect, it } from 'vitest';
import {
  findOrCreateCustomer,
  normalizeEmail,
  normalizeInstagram,
  normalizePhone,
} from '../customers';

/** Minimální in-memory náhrada `prisma.customer`. */
function fakeStore(rows: any[] = []) {
  let seq = 0;
  const matches = (row: any, where: Record<string, any>): boolean =>
    Object.entries(where).every(([key, value]) =>
      key === 'NOT' ? !matches(row, value) : row[key] === value
    );
  return {
    rows,
    async findFirst({ where }: any) { return rows.find((r) => matches(r, where)) ?? null; },
    async findMany({ where }: any) { return rows.filter((r) => matches(r, where)); },
    async create({ data }: any) { const row = { id: `c${++seq}`, ...data }; rows.push(row); return row; },
    async update({ where, data }: any) {
      const row = rows.find((r) => r.id === where.id);
      Object.assign(row, data);
      return row;
    },
  } as any;
}

describe('normalizace kontaktů', () => {
  it('e-mail', () => {
    expect(normalizeEmail('  Jana@Example.CZ ')).toBe('jana@example.cz');
    expect(normalizeEmail('neni-email')).toBeNull();
    expect(normalizeEmail('')).toBeNull();
  });
  it('telefon', () => {
    expect(normalizePhone('+420 728 722 880')).toBe('+420728722880');
    expect(normalizePhone('728-722-880')).toBe('728722880');
    expect(normalizePhone('12')).toBeNull();
  });
  it('Instagram', () => {
    expect(normalizeInstagram('@Muza.Hair')).toBe('muza.hair');
    expect(normalizeInstagram('https://www.instagram.com/muza.hair/?hl=cs')).toBe('muza.hair');
    expect(normalizeInstagram('instagram.com/jana_n')).toBe('jana_n');
    expect(normalizeInstagram('  ')).toBeNull();
  });
});

describe('findOrCreateCustomer', () => {
  it('založí zákazníka jen s Instagramem (bez e-mailu)', async () => {
    const db = fakeStore();
    const c = await findOrCreateCustomer({ firstName: 'Jana Nováková', instagramHandle: '@Jana_N', source: 'instagram' }, db);
    expect(c?.instagramHandle).toBe('jana_n');
    expect(c?.email).toBeNull();
    expect(db.rows).toHaveLength(1);
  });

  it('podruhé najde stejného zákazníka podle Instagramu a doplní e-mail', async () => {
    const db = fakeStore();
    const first = await findOrCreateCustomer({ firstName: 'Jana', instagramHandle: 'jana_n' }, db);
    const second = await findOrCreateCustomer({ firstName: 'Jana', instagramHandle: '@JANA_N', email: 'Jana@Example.cz' }, db);
    expect(second?.id).toBe(first?.id);
    expect(db.rows).toHaveLength(1);
    expect(db.rows[0].email).toBe('jana@example.cz');
  });

  it('e-mail má přednost před telefonem a prázdné pole nesmaže uložený údaj', async () => {
    const db = fakeStore();
    const first = await findOrCreateCustomer({ firstName: 'Petra', email: 'petra@example.cz', phone: '+420 111 222 333', street: 'Revoluční 8' }, db);
    const again = await findOrCreateCustomer({ firstName: 'Petra', email: 'petra@example.cz', phone: '', street: '' }, db);
    expect(again?.id).toBe(first?.id);
    expect(db.rows[0].phone).toBe('+420111222333');
    expect(db.rows[0].street).toBe('Revoluční 8');
  });

  it('nepřepíše e-mail, který už patří jinému zákazníkovi', async () => {
    const db = fakeStore();
    await findOrCreateCustomer({ firstName: 'A', email: 'a@example.cz' }, db);
    const b = await findOrCreateCustomer({ firstName: 'B', instagramHandle: 'bbb' }, db);
    // B teď uvede e-mail zákazníka A → spáruje se s A (e-mail má přednost), B zůstane beze změny
    const result = await findOrCreateCustomer({ firstName: 'B', instagramHandle: 'bbb', email: 'a@example.cz' }, db);
    expect(result?.email).toBe('a@example.cz');
    expect(db.rows.find((r: any) => r.id === b?.id)?.email).toBeNull();
    expect(db.rows).toHaveLength(2);
  });

  it('anonymní prodej (nic vyplněno) zákazníka nezaloží', async () => {
    const db = fakeStore();
    expect(await findOrCreateCustomer({}, db)).toBeNull();
    expect(db.rows).toHaveLength(0);
  });
});
