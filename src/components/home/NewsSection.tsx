import Link from 'next/link';

export const NewsSection = () => {
  const news = [
    {
      title: "New European Hub: Zurich (ZRH)",
      description: "punto.fly expands its international network with a new hub in Switzerland, offering seamless connections to Europe.",
      tag: "Destinations",
      colorClass: "bg-brand-purple",
    },
    {
      title: "Express Baggage Drop at Belorusskiy Station",
      description: "Free your hands before the flight. Drop off your baggage right at the Aeroexpress terminal for free.",
      tag: "Service",
      colorClass: "bg-brand-red",
    },
    {
      title: "Business Everywhere on SSJ100",
      description: "Experience premium comfort on all our domestic routes with upgraded service and amenities.",
      tag: "Premium",
      colorClass: "bg-brand-purple-light", 
    }
  ];

  return (
    <section className="py-20 bg-neutral-light/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold font-heading text-neutral-black mb-2">Latest Updates</h2>
            <p className="text-neutral-gray font-body">Discover new destinations and services.</p>
          </div>
          <Link href="/news" className="text-brand-red font-ui font-medium hover:text-brand-red-hover transition-colors hidden md:block">
            View all news &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-neutral-light/30 p-6 hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full">
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-ui text-white ${item.colorClass}`}>
                  {item.tag}
                </span>
              </div>
              <h3 className="text-xl font-bold font-heading text-neutral-black mb-3 group-hover:text-brand-red transition-colors">
                {item.title}
              </h3>
              <p className="text-neutral-gray font-body text-sm flex-1">
                {item.description}
              </p>
              <div className="mt-6 pt-4 border-t border-neutral-light/20">
                <span className="text-brand-red text-sm font-ui font-medium">Read more &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
