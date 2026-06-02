export default function FaresPage() {
  const fares = [
    {
      name: "Economy Basic",
      tagline: "Travel light, pay less",
      colorClass: "bg-brand-red/10 text-brand-red",
      features: [
        { label: "Carry-on luggage", value: "1 Small bag" },
        { label: "Baggage", value: "×" },
        { label: "Seat selection", value: "×" },
        { label: "Airport check-in", value: "×" },
        { label: "Security fast track", value: "×" },
        { label: "Lounge access", value: "×" },
        { label: "Meals & Drinks", value: "Snacks and drinks" },
        { label: "Loyalty miles", value: "25% miles" },
        { label: "Flexibility", value: "Non-changeable" },
      ]
    },
    {
      name: "Economy Plus",
      tagline: "The smart way to fly",
      colorClass: "bg-brand-red/20 text-brand-red-dark",
      features: [
        { label: "Carry-on luggage", value: "1 Standard bag" },
        { label: "Baggage", value: "1 Checked bag (23kg)" },
        { label: "Seat selection", value: "Free standard seat" },
        { label: "Airport check-in", value: "Standard desk" },
        { label: "Security fast track", value: "×" },
        { label: "Lounge access", value: "×" },
        { label: "Meals & Drinks", value: "Hot meal and drinks" },
        { label: "Loyalty miles", value: "100% miles" },
        { label: "Flexibility", value: "Fee applies" },
      ]
    },
    {
      name: "Economy Premium",
      tagline: "More space, more perks",
      colorClass: "bg-brand-purple-light/20 text-brand-purple",
      features: [
        { label: "Carry-on luggage", value: "1 Standard bag" },
        { label: "Baggage", value: "2 Checked bags (23kg)" },
        { label: "Seat selection", value: "Any economy seat" },
        { label: "Airport check-in", value: "Standard desk" },
        { label: "Security fast track", value: "Included" },
        { label: "Lounge access", value: "×" },
        { label: "Meals & Drinks", value: "Hot meal and drinks" },
        { label: "Loyalty miles", value: "150% miles" },
        { label: "Flexibility", value: "Free change" },
      ]
    },
    {
      name: "Business",
      tagline: "Excellence in the air",
      colorClass: "bg-brand-purple text-white",
      features: [
        { label: "Carry-on luggage", value: "2 Standard bags" },
        { label: "Baggage", value: "2 Checked bags (23kg)" },
        { label: "Seat selection", value: "Any business seat" },
        { label: "Airport check-in", value: "Business desk" },
        { label: "Security fast track", value: "Included" },
        { label: "Lounge access", value: "Included" },
        { label: "Meals & Drinks", value: "Gourmet menu and bar" },
        { label: "Loyalty miles", value: "200% miles" },
        { label: "Flexibility", value: "Free change and refund" },
      ]
    }
  ];

  const featureLabels = fares[0].features.map(f => f.label);

  return (
    <div className="bg-neutral-light/5 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-brand-red">Choose your way to fly</h1>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-neutral-light/20 overflow-hidden mb-24">
          <table className="w-full text-center">
            <thead>
              <tr>
                <th className="p-6 text-left w-1/5 bg-neutral-light/5 border-b border-neutral-light/30"></th>
                {fares.map((fare, i) => (
                  <th key={i} className="p-6 border-b border-neutral-light/30 align-top">
                    <div className={`py-3 px-4 rounded-full font-heading mb-2 ${fare.colorClass}`}>
                      {fare.name}
                    </div>
                    <div className="text-sm font-body text-neutral-gray font-normal">
                      {fare.tagline}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureLabels.map((label, rowIndex) => (
                <tr key={rowIndex} className="border-b border-neutral-light/20 last:border-0 hover:bg-neutral-light/5 transition-colors">
                  <td className="p-4 text-left font-ui font-medium text-neutral-black pl-8">{label}</td>
                  {fares.map((fare, colIndex) => {
                    const value = fare.features[rowIndex].value;
                    const isCheck = value === "Included" || value.includes("bag") || value.includes("miles") || value.includes("meal");
                    return (
                      <td key={colIndex} className={`p-4 font-body text-sm ${value === "×" ? "text-neutral-light text-xl" : "text-neutral-black"}`}>
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Business Everywhere Section */}
        <div className="bg-brand-purple rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row items-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-purple-light blur-3xl mix-blend-screen" />
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-brand-purple-hover blur-3xl mix-blend-screen" />
          </div>

          <div className="p-12 md:p-16 md:w-1/2 relative z-10 text-white">
            <div className="inline-block bg-white text-brand-purple font-heading font-bold px-6 py-2 rounded-lg text-xl md:text-3xl mb-4 transform -rotate-2">
              Бизнес
            </div>
            <br />
            <div className="inline-block bg-white text-brand-purple font-heading font-bold px-6 py-2 rounded-lg text-xl md:text-3xl mb-8 transform -rotate-2 ml-12">
              Повсюду
            </div>
            
            <h3 className="text-2xl font-bold mb-4 font-heading">
              Путешествуйте с повышенным комфортом по всей России
            </h3>
            <p className="font-body text-white/90 mb-8">
              Experience superior comfort while traveling throughout Russia. Business Class service is exclusively available on international routes and premium domestic lines. Enjoy priority boarding, gourmet catering, and unprecedented comfort on our modern fleet.
            </p>
          </div>
          <div className="md:w-1/2 h-full bg-brand-purple-dark flex items-center justify-center p-12">
             <div className="w-full aspect-video bg-brand-purple-hover/50 rounded-2xl flex flex-col items-center justify-center border border-white/20">
                <span className="font-heading text-4xl text-white/50 mb-4">SSJ-100</span>
                <span className="font-body text-white/70">Premium Cabin</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
