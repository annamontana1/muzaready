import { Metadata } from 'next';
import PriceMatrixTab from '../konfigurator-sku/tabs/PriceMatrixTab';

export const metadata: Metadata = {
  title: 'Matice cen | Múza Hair Admin',
  description: 'Správa cenové matice - ceny za 1g vlasů',
};

export default function PriceMatrixPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Matice cen</h1>
        <p className="mt-2 text-gray-600">
          Spravuj ceník vlasů. Všechny ceny jsou za 1 gram. Při uložení se automaticky přepočítávají na EUR.
        </p>
      </div>
      <PriceMatrixTab />
    </div>
  );
}
