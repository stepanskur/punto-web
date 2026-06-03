'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Plane } from 'lucide-react';
import { FlightSearchWidget } from '@/components/home/FlightSearchWidget';

// Types for the API response
interface RouteLink {
  airlineName: string;
  airlineId: number;
  fromAirportIata: string;
  toAirportIata: string;
  fromAirportCity: string;
  toAirportCity: string;
  duration: number;
  price: number;
  departure: number;
  arrival: number;
  flightCode: string;
  linkClass: string;
}

interface Route {
  route: RouteLink[];
  remarks?: string[];
}

interface Partner {
  id: number;
  name: string;
  imageUrl: string;
}

const formatTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

function FlightCard({ group, convertPrice, persons, partners, primaryCompanyId }: any) {
  const [expanded, setExpanded] = useState(false);
  
  const lowestPriceClass = Object.keys(group.prices).reduce((a, b) => group.prices[a] < group.prices[b] ? a : b, Object.keys(group.prices)[0]);
  const displayPrice = group.prices[lowestPriceClass];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-light/30 flex flex-col hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row gap-6 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1 space-y-6">
          {group.route.map((link: any, linkIdx: number) => (
            <div key={linkIdx} className="flex items-center gap-4">
              <div className="w-16 h-12 bg-neutral-light/10 flex items-center justify-center rounded overflow-hidden p-1">
                {partners.find((p: any) => p.id === link.airlineId)?.imageUrl ? (
                  <img src={partners.find((p: any) => p.id === link.airlineId)?.imageUrl} alt={link.airlineName} className="object-contain w-full h-full" />
                ) : (
                  <span className="text-[10px] font-bold text-center leading-tight">{link.airlineName}</span>
                )}
              </div>
              
              <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                <div>
                  <div className="text-xl font-bold font-ui">{formatTime(link.departure)}</div>
                  <div className="text-sm text-neutral-gray">{link.fromAirportIata}</div>
                </div>
                
                <div className="flex flex-col items-center justify-center relative w-24">
                  <div className="text-xs text-neutral-gray mb-1">{Math.floor(link.duration / 60)}h {link.duration % 60}m</div>
                  <div className="w-full h-px bg-neutral-light relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-red"></div>
                  </div>
                  <div className="text-[10px] text-neutral-gray mt-1 text-center truncate w-full">{link.airlineName} • {link.flightCode}</div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold font-ui">{formatTime(link.arrival)}</div>
                  <div className="text-sm text-neutral-gray">{link.toAirportIata}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="md:border-l border-neutral-light/30 md:pl-6 flex flex-col justify-center items-center md:items-end min-w-[120px]">
          {group.isPartner && (
            <span className="text-xs font-bold text-neutral-gray uppercase tracking-wider mb-2 bg-neutral-light/20 px-2 py-1 rounded">
              Partner Flight
            </span>
          )}
          <div className="text-2xl font-bold text-brand-red mb-1">{convertPrice(displayPrice)}</div>
          <div className="text-xs text-neutral-gray">{persons} person{persons > 1 ? 's' : ''}</div>
          <div className="text-[10px] text-neutral-gray mt-1 uppercase">from</div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-neutral-light/30 bg-neutral-light/5 p-6">
          <h4 className="font-bold font-ui mb-4 text-sm uppercase tracking-wider">Select Fare</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['economy', 'business', 'first'].map(cls => {
              const price = group.prices[cls];
              if (!price) return null;
              
              const isPunto = !group.isPartner;
              return (
                <div key={cls} className={`p-4 rounded-xl border ${isPunto ? 'border-brand-red/30 bg-white' : 'border-neutral-light/50 bg-white'} hover:border-brand-red cursor-pointer transition-all flex flex-col`}>
                  <div className="font-bold uppercase text-sm mb-1">{cls}</div>
                  <div className={`text-xl font-bold ${isPunto ? 'text-brand-red' : 'text-neutral-black'} mb-2`}>{convertPrice(price)}</div>
                  <div className="mt-auto">
                    <button className="w-full py-2 text-sm font-bold rounded-lg bg-neutral-light/20 text-neutral-gray hover:bg-brand-red hover:text-white transition-colors">
                      Select
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');
  const persons = parseInt(searchParams.get('persons') || '1');
  
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<'USD'|'RUB'|'EUR'>('USD');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [airlineFilter, setAirlineFilter] = useState<'primary'|'all'>('primary');
  
  const [primaryCompanyId, setPrimaryCompanyId] = useState<number>(17643);

  useEffect(() => {
    fetch('/api/partners').then(res => res.json()).then(data => {
      if (Array.isArray(data)) {
        setPartners(data);
      } else {
        setPrimaryCompanyId(data.primaryCompanyId || 17643);
        setPartners(data.partners || []);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!fromParam || !toParam) return;
    
    const fetchRoutes = async () => {
      setLoading(true);
      const start = Date.now();
      try {
        const fromCity = fromParam.split('(')[0].trim();
        const toCity = toParam.split('(')[0].trim();
        
        const fromRes = await fetch(`/api/airline-club/search-airport?input=${encodeURIComponent(fromCity)}`);
        const fromData = await fromRes.json();
        
        const toRes = await fetch(`/api/airline-club/search-airport?input=${encodeURIComponent(toCity)}`);
        const toData = await toRes.json();
        
        if (fromData.entries?.[0] && toData.entries?.[0]) {
          const fromId = fromData.entries[0].airportId;
          const toId = toData.entries[0].airportId;
          
          const routeRes = await fetch(`/api/airline-club/search-route/${fromId}/${toId}`);
          const routeData = await routeRes.json();
          setRoutes(routeData);
        } else {
          setRoutes([]);
        }
      } catch (err) {
        console.error(err);
        setRoutes([]);
      } finally {
        const elapsed = Date.now() - start;
        if (elapsed < 3500) {
          await new Promise(r => setTimeout(r, 3500 - elapsed));
        }
        setLoading(false);
      }
    };
    
    fetchRoutes();
  }, [fromParam, toParam]);

  const convertPrice = (priceInUsd: number) => {
    let result = priceInUsd;
    let symbol = '$';
    if (currency === 'RUB') { result = priceInUsd * 90; symbol = '₽'; }
    if (currency === 'EUR') { result = priceInUsd * 0.92; symbol = '€'; }
    return `${symbol}${Math.round(result * persons).toLocaleString()}`;
  };

  const filteredRoutes = routes.filter(r => {
    if (airlineFilter === 'primary') {
      return r.route.every(link => link.airlineId === primaryCompanyId);
    } else {
      const allowedIds = new Set([primaryCompanyId, ...partners.map(p => p.id)]);
      return r.route.every(link => allowedIds.has(link.airlineId));
    }
  });

  const groupedRoutes: Record<string, { route: RouteLink[], prices: Record<string, number>, isPartner: boolean, airlineName: string, airlineId: number }> = {};
  filteredRoutes.forEach(r => {
    const key = r.route.map(link => link.flightCode).join('-');
    if (!groupedRoutes[key]) {
      const isPartner = r.route.some(l => l.airlineId !== primaryCompanyId);
      groupedRoutes[key] = {
        route: r.route,
        prices: {},
        isPartner,
        airlineName: r.route[0].airlineName,
        airlineId: r.route[0].airlineId
      };
    }
    const rClass = r.route[0].linkClass;
    const rPrice = r.route.reduce((sum, link) => sum + link.price, 0);
    groupedRoutes[key].prices[rClass] = rPrice;
  });

  const hasAnyRoutes = routes.length > 0;
  const hasPartnerRoutes = routes.some(r => r.route.some(l => l.airlineId !== primaryCompanyId));

  return (
    <div className="bg-neutral-light/5 min-h-screen">
      <div className="border-b border-neutral-light/20 bg-white">
        <div className="[&>div]:mt-0 [&>div]:shadow-none [&>div]:border-none [&>div]:bg-transparent">
          <FlightSearchWidget />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-light/30">
            <h3 className="font-bold font-ui mb-4">Filters</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-neutral-gray mb-3 uppercase tracking-wider">Currency</h4>
              <div className="flex gap-2">
                {['USD', 'RUB', 'EUR'].map(cur => (
                  <button 
                    key={cur}
                    onClick={() => setCurrency(cur as 'USD'|'RUB'|'EUR')}
                    className={`flex-1 py-1 text-sm font-bold rounded-lg transition-colors ${currency === cur ? 'bg-brand-red text-white' : 'bg-neutral-light/20 text-neutral-gray hover:bg-neutral-light/40'}`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-neutral-gray mb-3 uppercase tracking-wider">Airlines</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" 
                    name="airline" 
                    checked={airlineFilter === 'primary'} 
                    onChange={() => setAirlineFilter('primary')}
                    className="accent-brand-red"
                  />
                  <span>Punto Fly</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" 
                    name="airline" 
                    checked={airlineFilter === 'all'} 
                    onChange={() => setAirlineFilter('all')}
                    className="accent-brand-red"
                  />
                  <span>Punto Fly + Partners</span>
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-neutral-gray mb-3 uppercase tracking-wider">Departure Time</h4>
              <p className="text-xs text-neutral-gray mb-1">Filter (UI only)</p>
              <input type="range" className="w-full accent-brand-red" />
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-neutral-gray mb-3 uppercase tracking-wider">Arrival Time</h4>
              <p className="text-xs text-neutral-gray mb-1">Filter (UI only)</p>
              <input type="range" className="w-full accent-brand-red" />
            </div>
          </div>
        </aside>

        <div className="flex-1 space-y-4">
          {loading && (
            <div className="bg-white rounded-2xl p-16 shadow-sm border border-neutral-light/30 flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative w-32 h-32 mb-8">
                {/* Globe/world background circle */}
                <div className="absolute inset-0 border-4 border-neutral-light/30 rounded-full"></div>
                {/* Spinning flight path */}
                <div className="absolute inset-0 border-4 border-transparent border-t-brand-red rounded-full animate-[spin_2s_linear_infinite]"></div>
                {/* Plane in center */}
                <div className="absolute inset-0 flex items-center justify-center text-brand-red">
                  <Plane className="w-12 h-12 animate-[pulse_1.5s_ease-in-out_infinite]" />
                </div>
              </div>
              <h3 className="text-2xl font-bold font-heading mb-2 text-neutral-black animate-pulse">Searching for the best flights...</h3>
              <p className="text-neutral-gray text-center max-w-sm">
                We're checking prices and routes across our partner network to find you the best deals.
              </p>
            </div>
          )}
          
          {!loading && !hasAnyRoutes && (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-neutral-light/30">
              <h3 className="text-xl font-bold font-heading mb-2">No flights found</h3>
              <p className="text-neutral-gray">We couldn't find any flights matching your current criteria.</p>
            </div>
          )}
          {!loading && hasAnyRoutes && filteredRoutes.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-neutral-light/30">
              <h3 className="text-xl font-bold font-heading mb-2">No flights found with current filters</h3>
              <p className="text-neutral-gray mb-4">Try relaxing your filters to see available flights.</p>
              {hasPartnerRoutes && airlineFilter === 'primary' && (
                <button 
                  onClick={() => setAirlineFilter('all')}
                  className="px-4 py-2 bg-brand-red/10 text-brand-red font-bold rounded-xl hover:bg-brand-red/20 transition-colors"
                >
                  Show Partner Flights
                </button>
              )}
            </div>
          )}
          
          {!loading && Object.entries(groupedRoutes).map(([key, group], idx) => (
            <FlightCard 
              key={idx} 
              group={group} 
              convertPrice={convertPrice} 
              persons={persons} 
              partners={partners} 
              primaryCompanyId={primaryCompanyId} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}