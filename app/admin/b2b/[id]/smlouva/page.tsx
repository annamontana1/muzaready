'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface B2bItem {
  id: string;
  druh: string;
  barva: string;
  delkaCm: number;
  gramaz: number;
  cenaPerGram: number;
  celkem: number;
  stav: string;
}

interface B2bShipment {
  id: string;
  date: string;
  items: B2bItem[];
}

interface B2bPartnerDetail {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  ico: string | null;
  address: string | null;
  shipments: B2bShipment[];
}

function formatCzk(val: number) {
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(val);
}

export default function KomisniSmlouvaPage() {
  const { id } = useParams<{ id: string }>();
  const [partner, setPartner] = useState<B2bPartnerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const fetchPartner = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/b2b/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPartner(data);
      }
    } catch (err) {
      console.error('Chyba:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPartner();
  }, [fetchPartner]);

  const handleSendEmail = async () => {
    if (!partner?.email) {
      alert('Partner nema zadany email');
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`/api/admin/b2b/${id}/send-contract`, { method: 'POST' });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        alert(data.error || 'Chyba pri odesilani');
      }
    } catch {
      alert('Chyba pri odesilani smlouvy');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-stone-400">Nacitam...</div>;
  }

  if (!partner) {
    return (
      <div className="p-12 text-center text-stone-400">
        Partner nenalezen.{' '}
        <Link href="/admin/b2b" className="text-[#722F37] hover:underline">Zpet</Link>
      </div>
    );
  }

  // Get items that are "skladem" (in stock at the partner)
  const sklademItems = partner.shipments.flatMap((s) => s.items).filter((i) => i.stav === 'skladem');
  const totalValue = sklademItems.reduce((sum, i) => sum + i.celkem, 0);
  const todayStr = new Date().toLocaleDateString('cs-CZ');

  return (
    <div className="max-w-[900px] mx-auto">
      {/* Action bar - hidden in print */}
      <div className="print:hidden px-4 py-4 flex items-center justify-between">
        <Link href={`/admin/b2b/${id}`} className="text-sm text-stone-500 hover:text-[#722F37]">
          &larr; Zpet na detail partnera
        </Link>
        <div className="flex gap-2">
          <button
            onClick={handleSendEmail}
            disabled={sending || !partner.email}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {sent ? 'Odeslano!' : sending ? 'Odesilam...' : 'Odeslat na email'}
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#722F37] hover:bg-[#5a252c] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Tisknout
          </button>
        </div>
      </div>

      {/* Contract content */}
      <div className="bg-white shadow-sm rounded-xl print:shadow-none print:rounded-none px-10 py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800 tracking-wide uppercase">Komisní smlouva</h1>
          <p className="text-xs text-stone-400 mt-1">dle §2455–2470 zákona č. 89/2012 Sb., občanského zákoníku</p>
          <div className="w-16 h-0.5 bg-[#722F37] mx-auto mt-3" />
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Komitent (dodavatel)</h3>
            <div className="text-sm text-stone-800 space-y-1">
              <div className="font-semibold">Anna Zvinchuk</div>
              <div>ICO: 17989230</div>
              <div>Sramkova 430/12, Lesna</div>
              <div>638 00 Brno</div>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Komisář (prodejce)</h3>
            <div className="text-sm text-stone-800 space-y-1">
              <div className="font-semibold">{partner.name}</div>
              {partner.ico && <div>ICO: {partner.ico}</div>}
              {partner.contactName && <div>Kontakt: {partner.contactName}</div>}
              {partner.address && <div>{partner.address}</div>}
              {partner.email && <div>{partner.email}</div>}
            </div>
          </div>
        </div>

        {/* Subject */}
        <div>
          <h3 className="text-sm font-semibold text-stone-800 mb-3">Příloha: Soupis svěřeného zboží</h3>
          <p className="text-sm text-stone-600 mb-4">
            Komitent předává komisáři k prodeji následující zboží:
          </p>

          {sklademItems.length === 0 ? (
            <div className="text-sm text-stone-400 italic">Zadne polozky se stavem &quot;skladem&quot;.</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-stone-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="text-left px-3 py-2 font-medium text-stone-500">#</th>
                    <th className="text-left px-3 py-2 font-medium text-stone-500">Druh</th>
                    <th className="text-left px-3 py-2 font-medium text-stone-500">Barva</th>
                    <th className="text-right px-3 py-2 font-medium text-stone-500">Delka</th>
                    <th className="text-right px-3 py-2 font-medium text-stone-500">Gramaz</th>
                    <th className="text-right px-3 py-2 font-medium text-stone-500">Cena/g</th>
                    <th className="text-right px-3 py-2 font-medium text-stone-500">Celkem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {sklademItems.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="px-3 py-2 text-stone-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-stone-700">{item.druh}</td>
                      <td className="px-3 py-2 text-stone-700">{item.barva}</td>
                      <td className="px-3 py-2 text-right text-stone-600">{item.delkaCm} cm</td>
                      <td className="px-3 py-2 text-right text-stone-600">{item.gramaz} g</td>
                      <td className="px-3 py-2 text-right text-stone-600">{item.cenaPerGram} Kc</td>
                      <td className="px-3 py-2 text-right font-medium text-stone-800">{formatCzk(item.celkem)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-stone-50 border-t border-stone-200">
                    <td colSpan={6} className="px-3 py-2 text-right font-semibold text-stone-700">Celkova hodnota:</td>
                    <td className="px-3 py-2 text-right font-bold text-stone-800">{formatCzk(totalValue)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Legal basis */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-stone-800 mb-2">I. Právní základ</h3>
          <p className="text-sm text-stone-600">
            Tato smlouva se uzavírá v souladu s ustanoveními §2455–2470 zákona č. 89/2012 Sb., občanského zákoníku, ve znění pozdějších předpisů (dále jen „občanský zákoník").
          </p>
        </div>

        {/* Subject */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-stone-800 mb-2">II. Předmět smlouvy</h3>
          <ol className="text-sm text-stone-600 space-y-1.5 list-decimal list-inside">
            <li>Komitent se zavazuje předat komisáři zboží specifikované v příloze této smlouvy (viz tabulka výše) k obstarání prodeje třetím osobám.</li>
            <li>Komisář se zavazuje obstarat na účet komitenta vlastním jménem prodej svěřeného zboží za podmínek stanovených touto smlouvou.</li>
            <li>Komisář není povinen zboží koupit, pouze jej nabízí k prodeji třetím osobám.</li>
          </ol>
        </div>

        {/* Ownership */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-stone-800 mb-2">III. Vlastnické právo</h3>
          <ol className="text-sm text-stone-600 space-y-1.5 list-decimal list-inside">
            <li>Zboží zůstává ve vlastnictví komitenta až do okamžiku jeho prodeje třetí osobě a úplného zaplacení kupní ceny komisáři.</li>
            <li>Komisář je povinen svěřené zboží odděleně skladovat a řádně označit jako zboží ve vlastnictví komitenta.</li>
            <li>Komisář nesmí se zbožím nakládat jiným způsobem než prodejem dle této smlouvy.</li>
          </ol>
        </div>

        {/* Price and payment */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-stone-800 mb-2">IV. Cena a platební podmínky</h3>
          <ol className="text-sm text-stone-600 space-y-1.5 list-decimal list-inside">
            <li>Minimální prodejní cena zboží je stanovena dle ceníku komitenta uvedeného v tabulce výše.</li>
            <li>Komisář nesmí prodat zboží pod stanovenou minimální cenu bez předchozího písemného souhlasu komitenta.</li>
            <li>Komisář je povinen uhradit komitentovi výtěžek z prodeje nejpozději do 30 kalendářních dnů od uskutečnění prodeje.</li>
            <li>Platby probíhají bezhotovostním převodem na účet komitenta: 321286011/0300.</li>
            <li>Komitent je neplátce DPH — všechny ceny jsou konečné.</li>
          </ol>
        </div>

        {/* Obligations */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-stone-800 mb-2">V. Povinnosti komisáře</h3>
          <ol className="text-sm text-stone-600 space-y-1.5 list-decimal list-inside">
            <li>Komisář je povinen vykonávat činnost s odbornou péčí a chránit zájmy komitenta.</li>
            <li>Komisář je povinen informovat komitenta o stavu prodeje svěřeného zboží, a to nejméně jednou měsíčně.</li>
            <li>Komisář odpovídá za poškození, ztrátu nebo zničení svěřeného zboží od jeho převzetí do předání kupujícímu nebo vrácení komitentovi.</li>
            <li>Komisář je povinen na vyžádání komitenta kdykoli umožnit kontrolu svěřeného zboží.</li>
            <li>Komisář nesmí svěřené zboží zastavit, pronajmout ani jinak zatížit právy třetích osob.</li>
          </ol>
        </div>

        {/* Return */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-stone-800 mb-2">VI. Vrácení zboží</h3>
          <ol className="text-sm text-stone-600 space-y-1.5 list-decimal list-inside">
            <li>Neprodané zboží je komisář povinen vrátit komitentovi na jeho vyžádání, a to do 14 dnů od doručení výzvy.</li>
            <li>Zboží musí být vráceno v původním stavu a kvalitě, v jakém bylo komisáři předáno.</li>
            <li>Náklady na vrácení zboží nese komisář.</li>
          </ol>
        </div>

        {/* Duration */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-stone-800 mb-2">VII. Doba trvání a ukončení</h3>
          <ol className="text-sm text-stone-600 space-y-1.5 list-decimal list-inside">
            <li>Tato smlouva se uzavírá na dobu neurčitou.</li>
            <li>Každá ze stran může smlouvu vypovědět písemnou výpovědí s výpovědní dobou 30 dnů.</li>
            <li>Komitent může smlouvu vypovědět s okamžitou účinností v případě podstatného porušení povinností komisáře.</li>
            <li>Při ukončení smlouvy je komisář povinen vrátit veškeré neprodané zboží a vyúčtovat všechny uskutečněné prodeje do 14 dnů.</li>
          </ol>
        </div>

        {/* Final provisions */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-stone-800 mb-2">VIII. Závěrečná ustanovení</h3>
          <ol className="text-sm text-stone-600 space-y-1.5 list-decimal list-inside">
            <li>Tato smlouva nabývá platnosti a účinnosti dnem podpisu oběma smluvními stranami.</li>
            <li>Změny a doplňky této smlouvy jsou platné pouze v písemné formě podepsané oběma stranami.</li>
            <li>Práva a povinnosti touto smlouvou neupravené se řídí příslušnými ustanoveními občanského zákoníku.</li>
            <li>Smlouva je vyhotovena ve dvou stejnopisech, z nichž každá smluvní strana obdrží po jednom.</li>
            <li>Smluvní strany prohlašují, že si smlouvu přečetly, jejímu obsahu rozumí a na důkaz své svobodné a vážné vůle připojují své podpisy.</li>
          </ol>
        </div>

        {/* Date and signatures */}
        <div className="pt-4">
          <div className="text-sm text-stone-600 mb-16">
            V Brně dne: {todayStr}
          </div>

          <div className="grid grid-cols-2 gap-16">
            <div className="text-center">
              <div className="border-t border-stone-300 pt-2">
                <div className="text-sm font-medium text-stone-700">Komitent</div>
                <div className="text-xs text-stone-400 mt-0.5">Anna Zvinchuk</div>
                <div className="text-xs text-stone-400">IČO: 17989230</div>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-stone-300 pt-2">
                <div className="text-sm font-medium text-stone-700">Komisář</div>
                <div className="text-xs text-stone-400 mt-0.5">{partner.name}</div>
                {partner.ico && <div className="text-xs text-stone-400">IČO: {partner.ico}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
