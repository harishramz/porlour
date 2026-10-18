const services = [
  { name: 'Eyebrow Threading', price: '₹39', accent: 'bg-[#F8F1DD]' },
  { name: 'Full Arms Waxing — Honey', price: '₹279', accent: 'bg-[#F9EAEA]' },
  { name: 'Gold Facial', price: '₹799', accent: 'bg-[#F5EBE1]' },
  { name: 'Hair Spa — Shoulder Length', price: '₹699', accent: 'bg-[#FDFBF7]' }
];

const stats = [
  { label: 'Menu Items', value: '68' },
  { label: 'Categories', value: '4' },
  { label: 'Original Menu Pages', value: '3' }
];

const perks = [
  'Prices transcribed from the supplied salon menu',
  'Threading, waxing, massage, skin, nail and hair services',
  'Unpriced menu services clearly marked for enquiry',
  'Book online or view the original menu pages'
];

const heroImage = '/images/her-glow-logo.jpeg';

function App() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] antialiased selection:bg-[#EEDDAF] selection:text-[#1A1A1A]">
      <div className="bg-[#1A1A1A] text-[#F5EFEB] text-[11px] uppercase tracking-[0.24em] py-2 px-4 flex items-center justify-center gap-3">
        <span>✨</span>
        <span>Live Interactive Preview</span>
      </div>

      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/her-glow-logo.jpeg" alt="" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="font-serif text-2xl leading-none tracking-wider">HER GLOW</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#737373]">Home Salon</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-[#404040]">
            <a href="#" className="hover:text-[#1A1A1A]">Home</a>
            <a href="#" className="hover:text-[#1A1A1A]">Services</a>
            <a href="#" className="hover:text-[#1A1A1A]">Offers</a>
            <a href="#" className="hover:text-[#1A1A1A]">Gallery</a>
            <a href="#" className="hover:text-[#1A1A1A]">Contact</a>
          </div>

          <button className="bg-[#C5A059] text-white px-5 py-2.5 rounded-full shadow-[0_12px_30px_-12px_rgba(197,160,89,0.8)] text-sm font-medium">
            Book Now
          </button>
        </nav>
      </header>

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2 bg-[#FAF6F0] border border-[#E4CA80]/60 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-[#8E6E2E]">
                <span>✦</span>
                <span>Her Glow Home Salon</span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl leading-[0.94] tracking-tight text-[#1A1A1A]">
                Look Good. <span className="italic text-[#B08B42]">Feel Good. Be You.</span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg text-[#404040] leading-relaxed">
                Explore home salon services and prices from the Her Glow menu.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#C5A059] hover:bg-[#B08B42] text-white px-6 py-3 rounded-full shadow-gold text-sm font-semibold transition">
                  Book an Appointment
                </button>
                <button className="border border-[#EBD9CC] bg-white text-[#1A1A1A] px-6 py-3 rounded-full text-sm font-semibold transition hover:bg-[#FAF6F0]">
                  Explore Services
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 max-w-lg">
                {stats.map((stat) => (
                  <div key={stat.label} className="border-t border-[#EBD9CC] pt-4">
                    <div className="font-serif text-3xl text-[#1A1A1A]">{stat.value}</div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#737373] mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#EEDDAF]/50 via-[#FAF6F0]/50 to-[#F2D3D4]/30 blur-xl rounded-[2rem]" />
              <div className="relative overflow-hidden rounded-[2rem] border-2 border-white/80 shadow-[0_25px_70px_rgba(0,0,0,0.12)] bg-[#fff2ee]">
                <img src={heroImage} alt="Her Glow Home Salon logo" className="w-full h-[520px] object-contain" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#FAF6F0] border-y border-[#EBD9CC] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="text-[11px] uppercase tracking-[0.28em] text-[#8E6E2E] mb-3">Tailored Rituals</div>
              <h2 className="font-serif text-4xl sm:text-5xl text-[#1A1A1A]">Signature Services</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <div key={service.name} className={`${service.accent} rounded-[1.5rem] border border-[#EBD9CC] p-5 shadow-subtle`}>
                  <div className="h-28 rounded-[1.25rem] bg-white/60 mb-4 flex items-center justify-center text-3xl">✦</div>
                  <div className="text-lg font-semibold text-[#1A1A1A]">{service.name}</div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[#8E6E2E] font-semibold">{service.price}</span>
                    <button className="text-sm text-[#1A1A1A] hover:text-[#8E6E2E]">Book</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto space-y-5">
            <div className="space-y-5">
              <div className="text-[11px] uppercase tracking-[0.28em] text-[#8E6E2E]">Why choose us</div>
              <h2 className="font-serif text-4xl sm:text-5xl text-[#1A1A1A]">Her Glow Home Salon</h2>
              <p className="text-[#404040] leading-relaxed">
                Find the menu, location and appointment options for Her Glow.
              </p>

              <ul className="space-y-3">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-[#1A1A1A]">
                    <span className="mt-1 text-[#B08B42]">✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
