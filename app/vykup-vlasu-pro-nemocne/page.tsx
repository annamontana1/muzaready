export default function VykupVlasuPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-playfair text-burgundy mb-6">
          Výkup vlasů pro nemocné
        </h1>

        <div className="bg-ivory p-8 rounded-xl mb-8">
          <p className="text-xl text-gray-700 mb-4">
            <strong className="text-burgundy">Každý 10. culík pro děti s onkologickým onemocněním</strong>
          </p>
          <p className="text-gray-700">
            Pomáháme nemocným dětem tím, že z nakoupených vlasů zdarma vyrábíme paruky.
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">
          <h2 className="text-2xl font-playfair text-burgundy">Jak to funguje?</h2>
          <p>
            Pokud máte zdravé, dlouhé vlasy, které chcete darovat, kontaktujte nás.
            Vaše vlasy mohou pomoci někomu, kdo je opravdu potřebuje.
          </p>

          <h2 className="text-2xl font-playfair text-burgundy mt-8">Podmínky</h2>
          <ul className="space-y-2">
            <li>Minimální délka: 25 cm</li>
            <li>Zdravé, nepoškozené vlasy</li>
            <li>Bez chemického ošetření (možné mírné barvení)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
