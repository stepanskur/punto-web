export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <h1 className="text-4xl font-bold font-heading text-neutral-black mb-12">Legal Information</h1>
      
      <section id="terms" className="mb-12">
        <h2 className="text-2xl font-bold font-heading text-brand-red mb-4">Terms & Conditions</h2>
        <div className="prose font-body text-neutral-gray">
          <p className="mb-4">Welcome to punto.fly. By using our website and services, you agree to these terms.</p>
          <p>Fare rules, including change and refund policies, are subject to the specific terms selected at the time of booking. The airline reserves the right to modify service offerings without prior notice.</p>
        </div>
      </section>

      <section id="carriage" className="mb-12">
        <h2 className="text-2xl font-bold font-heading text-brand-red mb-4">Conditions of Carriage</h2>
        <div className="prose font-body text-neutral-gray">
          <p className="mb-4">Baggage allowance and seat availability may vary depending on aircraft type and route. Fast Track services are available exclusively at Sheremetyevo International Airport (SVO).</p>
          <p>Business Class cabin and amenities are not available on Sukhoi Superjet 100 regional flights. Passengers booking on these routes will enjoy our premium Economy services.</p>
        </div>
      </section>
    </div>
  );
}
