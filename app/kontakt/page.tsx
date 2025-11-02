export default function KontaktPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-playfair text-burgundy mb-8">Kontakt</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-ivory p-8 rounded-xl">
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Kontaktní údaje</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Mùza Hair Shop</strong></p>
              <p>Praha, Česká republika</p>
              <p className="mt-4">
                <strong>Instagram:</strong>{' '}
                <a href="https://www.instagram.com/muzahair.cz" target="_blank" className="text-burgundy hover:underline">
                  @muzahair.cz
                </a>
              </p>
            </div>
          </div>

          <div className="bg-ivory p-8 rounded-xl">
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Kontaktní formulář</h2>
            <form className="space-y-4">
              <div>
                <label className="form-label">Jméno</label>
                <input type="text" className="form-input" />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" />
              </div>
              <div>
                <label className="form-label">Zpráva</label>
                <textarea className="form-input" rows={4}></textarea>
              </div>
              <button className="btn-primary w-full">Odeslat</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
