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
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-12 bg-neutral-light/10 flex items-center justify-center rounded overflow-hidden p-1 flex-shrink-0">
              {partners.find((p: any) => p.id === group.route[0].airlineId)?.imageUrl ? (
                <img src={partners.find((p: any) => p.id === group.route[0].airlineId)?.imageUrl} alt={group.route[0].airlineName} className="object-contain w-full h-full" />
              ) : (
                <span className="text-[10px] font-bold text-center leading-tight">{group.route[0].airlineName}</span>
              )}
            </div>
            
            <div className="flex-1 grid grid-cols-[auto_1fr_auto] gap-4 items-center">
              <div>
                <div className="text-xl font-bold font-ui">{formatTime(group.route[0].departure)}</div>
                <div className="text-sm text-neutral-gray">{group.route[0].fromAirportIata}</div>
              </div>
              
              <div className="flex flex-col items-center justify-center relative w-full px-4 min-w-[100px]">
                <div className="text-xs text-neutral-gray mb-1 text-center">
                  {group.route.length === 1 ? 'Direct' : `${group.route.length - 1} stop${group.route.length > 2 ? 's' : ''}`}
                </div>
                <div className="w-full h-px bg-neutral-light relative flex justify-between items-center z-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-red"></div>
                  {group.route.slice(0, -1).map((_: any, idx: number) => (
                    <div key={idx} className="w-1.5 h-1.5 rounded-full bg-neutral-gray"></div>
                  ))}
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-red"></div>
                </div>
                <div className="text-[10px] text-neutral-gray mt-1 text-center truncate w-full">
                  {group.route.map((l: any) => l.airlineName).filter((v: any, i: any, a: any) => a.indexOf(v) === i).join(', ')}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold font-ui">{formatTime(group.route[group.route.length - 1].arrival)}</div>
                <div className="text-sm text-neutral-gray">{group.route[group.route.length - 1].toAirportIata}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:border-l border-neutral-light/30 md:pl-6 flex flex-col justify-center items-center md:items-end min-w-[120px] flex-shrink-0">
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
          <div className={`grid grid-cols-1 gap-4 ${!group.isPartner ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
            {group.isPartner ? (
              ['economy', 'business', 'first'].map(cls => {
                const price = group.prices[cls];
                if (!price) return null;
                
                return (
                  <div key={cls} className="p-4 rounded-xl border border-neutral-light/50 bg-white hover:border-brand-red cursor-pointer transition-all flex flex-col">
                    <div className="font-bold uppercase text-sm mb-1">{cls}</div>
                    <div className="text-xl font-bold text-neutral-black">{convertPrice(price)}</div>
                  </div>
                );
              })
            ) : (
              <>
                {[
                  { name: 'Economy Basic', baseCls: 'economy', add: 0, perks: '1x Cabin bag (8kg)' },
                  { name: 'Economy Plus', baseCls: 'economy', add: 50, perks: '1x Cabin bag + 1x Checked (23kg) + Free seat selection' },
                  { name: 'Economy Premium', baseCls: 'economy', add: 100, perks: '1x Cabin bag + 2x Checked (23kg) + Priority Boarding' },
                  { name: 'Business', baseCls: 'business', add: 0, perks: '2x Cabin + 2x Checked (32kg) + Lounge + Lie-flat seat' }
                ].map((fare) => {
                  const basePrice = group.prices[fare.baseCls] || (group.prices['economy'] * (fare.baseCls === 'business' ? 3 : 1));
                  if (!basePrice && fare.baseCls !== 'business') return null;
                  const finalPrice = basePrice + fare.add;
                  
                  return (
                    <div key={fare.name} className="p-4 rounded-xl border border-brand-red/30 bg-white hover:border-brand-red cursor-pointer transition-all flex flex-col h-full">
                      <div className="font-bold uppercase text-sm mb-1 text-brand-red">{fare.name}</div>
                      <div className="text-xl font-bold text-brand-red mb-3">{convertPrice(finalPrice)}</div>
                      <div className="mt-auto pt-3 border-t border-neutral-light/30">
                        <div className="text-xs text-neutral-gray leading-relaxed">{fare.perks}</div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
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
  const depParam = searchParams.get('dep');
  const retParam = searchParams.get('ret');
  const classParam = searchParams.get('class');
  const persons = parseInt(searchParams.get('persons') || '1');
  const tripType = searchParams.get('tripType') || 'one';
  
  const [routes, setRoutes] = useState<Route[]>([]);
  const [returnRoutes, setReturnRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<'USD'|'RUB'|'EUR'>('USD');
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('punto_currency');
      if (stored) setCurrency(stored as any);
      
      const handleStorage = () => {
        const updated = localStorage.getItem('punto_currency');
        if (updated) setCurrency(updated as any);
      };
      window.addEventListener('storage', handleStorage);
      window.addEventListener('currency-change', handleStorage);
      return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener('currency-change', handleStorage);
      };
    }
  }, []);
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
    
    const fetchRoutesWithFallback = async (fId: number, tId: number) => {
      let data = await (await fetch(`/api/airline-club/search-route/${fId}/${tId}`)).json();
      if (!data || data.length === 0) {
        // Manual connection calculation
        const hubIatas = ['SVO', 'LED', 'ZRH', 'LHR', 'CDG', 'JFK', 'DXB', 'NRT'];
        const hubIds = await Promise.all(hubIatas.map(async iata => {
          try {
            const r = await (await fetch(`/api/airline-club/search-airport?input=${iata}`)).json();
            return r.entries?.[0]?.airportId;
          } catch { return null; }
        }));
        
        for (const hId of hubIds) {
          if (!hId || hId === fId || hId === tId) continue;
          try {
            const leg1 = await (await fetch(`/api/airline-club/search-route/${fId}/${hId}`)).json();
            if (leg1 && leg1.length > 0) {
              const leg2 = await (await fetch(`/api/airline-club/search-route/${hId}/${tId}`)).json();
              if (leg2 && leg2.length > 0) {
                for (const l1 of leg1) {
                  for (const l2 of leg2) {
                    const arr1 = l1.route[l1.route.length - 1].arrival;
                    let dep2 = l2.route[0].departure;
                    // If departure is earlier in the week than arrival, assume next week
                    if (dep2 < arr1) dep2 += 7 * 24 * 60; 
                    
                    const connectionTime = dep2 - arr1;
                    if (connectionTime > 60 && connectionTime < 24 * 60) { // between 1 and 24 hours
                      if (!data) data = [];
                      data.push({
                        route: [...l1.route, ...l2.route]
                      });
                    }
                  }
                }
              }
            }
          } catch {}
          if (data && data.length > 0) break; // Break early if we found some routes
        }
      }
      return data || [];
    };

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
          
          const routeData = await fetchRoutesWithFallback(fromId, toId);
          setRoutes(routeData);
          
          if (tripType === 'round') {
            const retData = await fetchRoutesWithFallback(toId, fromId);
            setReturnRoutes(retData);
          } else {
            setReturnRoutes([]);
          }
        } else {
          setRoutes([]);
          setReturnRoutes([]);
        }
      } catch (err) {
        console.error(err);
        setRoutes([]);
        setReturnRoutes([]);
      } finally {
        const elapsed = Date.now() - start;
        if (elapsed < 3500) {
          await new Promise(r => setTimeout(r, 3500 - elapsed));
        }
        setLoading(false);
      }
    };
    
    fetchRoutes();
  }, [fromParam, toParam, depParam, retParam, classParam, persons, tripType]);

  const convertPrice = (priceInUsd: number) => {
    let result = priceInUsd;
    let symbol = '$';
    if (currency === 'RUB') { result = priceInUsd * 90; symbol = '₽'; }
    if (currency === 'EUR') { result = priceInUsd * 0.92; symbol = '€'; }
    return `${symbol}${Math.round(result * persons).toLocaleString()}`;
  };

  const filterAndGroup = (routesList: Route[]) => {
    const filtered = routesList.filter(r => {
      if (airlineFilter === 'primary') {
        return r.route.every(link => link.airlineId === primaryCompanyId);
      } else {
        const allowedIds = new Set([primaryCompanyId, ...partners.map(p => p.id)]);
        return r.route.every(link => allowedIds.has(link.airlineId));
      }
    });

    const grouped: Record<string, { route: RouteLink[], prices: Record<string, number>, isPartner: boolean, airlineName: string, airlineId: number }> = {};
    filtered.forEach(r => {
      const key = r.route.map(link => link.flightCode).join('-');
      if (!grouped[key]) {
        const isPartner = r.route.some(l => l.airlineId !== primaryCompanyId);
        grouped[key] = {
          route: r.route,
          prices: {},
          isPartner,
          airlineName: r.route[0].airlineName,
          airlineId: r.route[0].airlineId
        };
      }
      const rClass = r.route[0].linkClass;
      const rPrice = r.route.reduce((sum, link) => sum + link.price, 0);
      grouped[key].prices[rClass] = rPrice;
    });
    return { filtered, grouped: Object.values(grouped) };
  };

  const { filtered: filteredRoutes, grouped: groupedDeparture } = filterAndGroup(routes);
  const { filtered: filteredReturn, grouped: groupedReturn } = filterAndGroup(returnRoutes);

  const hasAnyRoutes = routes.length > 0 || returnRoutes.length > 0;
  const hasPartnerRoutes = [...routes, ...returnRoutes].some(r => r.route.some(l => l.airlineId !== primaryCompanyId));

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
              <h4 className="text-sm font-semibold text-neutral-gray mb-3 uppercase tracking-wider">Stops</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="stops" className="accent-brand-red" defaultChecked />
                  <span>Any number of stops</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="stops" className="accent-brand-red" />
                  <span>Non-stop only</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="stops" className="accent-brand-red" />
                  <span>Up to 1 stop</span>
                </label>
              </div>
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
          {!loading && hasAnyRoutes && filteredRoutes.length === 0 && filteredReturn.length === 0 && (
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
          
          {!loading && tripType === 'one' && groupedDeparture.map((group, idx) => (
            <FlightCard 
              key={`dep-${idx}`} 
              group={group} 
              convertPrice={convertPrice} 
              persons={persons} 
              partners={partners} 
              primaryCompanyId={primaryCompanyId} 
            />
          ))}

          {!loading && tripType === 'round' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold font-heading mb-4 text-neutral-black">Departure Flights</h3>
                <div className="space-y-4">
                  {groupedDeparture.length > 0 ? groupedDeparture.map((group, idx) => (
                    <FlightCard 
                      key={`dep-${idx}`} 
                      group={group} 
                      convertPrice={convertPrice} 
                      persons={persons} 
                      partners={partners} 
                      primaryCompanyId={primaryCompanyId} 
                    />
                  )) : (
                    <div className="bg-white rounded-2xl p-6 text-center text-neutral-gray border border-neutral-light/30">No departure flights found</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold font-heading mb-4 text-neutral-black">Return Flights</h3>
                <div className="space-y-4">
                  {groupedReturn.length > 0 ? groupedReturn.map((group, idx) => (
                    <FlightCard 
                      key={`ret-${idx}`} 
                      group={group} 
                      convertPrice={convertPrice} 
                      persons={persons} 
                      partners={partners} 
                      primaryCompanyId={primaryCompanyId} 
                    />
                  )) : (
                    <div className="bg-white rounded-2xl p-6 text-center text-neutral-gray border border-neutral-light/30">No return flights found</div>
                  )}
                </div>
              </div>
            </div>
          )}
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