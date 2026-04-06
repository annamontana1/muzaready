interface PagePlaceholderProps {
  title: string;
  description: string;
  icon?: string;
}

export default function PagePlaceholder({ title, description, icon = '🚧' }: PagePlaceholderProps) {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <div className="text-8xl mb-6">{icon}</div>
        <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-6">
          {title}
        </h1>
        <p className="text-lg text-text-mid mb-8">
          {description}
        </p>
        <div className="p-6 bg-ivory rounded-lg">
          <p className="text-sm text-text-mid">
            Tato stránka je ve vývoji. Brzy zde najdete kompletní informace a produkty.
          </p>
        </div>
      </div>
    </div>
  );
}
