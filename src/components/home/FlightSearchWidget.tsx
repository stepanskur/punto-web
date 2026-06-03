'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { PlaneTakeoff, PlaneLanding, Calendar, Users, ArrowRightLeft, Plus, Minus, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const AIRPORTS = [
  { code: 'SVO', city: 'Moscow', country: 'Russia' },
  { code: 'LED', city: 'St. Petersburg', country: 'Russia' },
  { code: 'ZRH', city: 'Zurich', country: 'Switzerland' },
  { code: 'LHR', city: 'London', country: 'UK' },
  { code: 'CDG', city: 'Paris', country: 'France' },
  { code: 'JFK', city: 'New York', country: 'USA' },
  { code: 'DXB', city: 'Dubai', country: 'UAE' },
  { code: 'NRT', city: 'Tokyo', country: 'Japan' }
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const FlightSearchWidget = ({ compact = false }: { compact?: boolean }) => {
  const router = useRouter();
  const [tripType, setTripType] = useState('one');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  
  const [isTravelersOpen, setIsTravelersOpen] = useState(false);
  const [persons, setPersons] = useState(1);
  const [travelClass, setTravelClass] = useState('Economy');

  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [isDatesOpen, setIsDatesOpen] = useState(false);
  
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const travelersRef = useRef<HTMLDivElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) setIsFromOpen(false);
      if (toRef.current && !toRef.current.contains(event.target as Node)) setIsToOpen(false);
      if (travelersRef.current && !travelersRef.current.contains(event.target as Node)) setIsTravelersOpen(false);
      if (datesRef.current && !datesRef.current.contains(event.target as Node)) setIsDatesOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const [availableAirports, setAvailableAirports] = useState<{code: string, city: string, country: string}[]>([]);

  useEffect(() => {
    // Load all allowed airports dynamically based on links
    const loadAirports = async () => {
      try {
        const partnersRes = await fetch('/api/partners');
        const partnersData = await partnersRes.json();
        
        let companyIds = [];
        if (Array.isArray(partnersData)) {
          companyIds = [17643, ...partnersData.map((p: any) => p.id)];
        } else {
          companyIds = [partnersData.primaryCompanyId, ...(partnersData.partners || []).map((p: any) => p.id)];
        }

        const airportsMap = new Map();
        
        await Promise.all(companyIds.map(async (id) => {
          try {
            const res = await fetch(`/api/airline-club/airlines/${id}/links`);
            const links = await res.json();
            links.forEach((link: any) => {
              if (!airportsMap.has(link.fromAirportCode)) {
                airportsMap.set(link.fromAirportCode, { code: link.fromAirportCode, city: link.fromAirportCity, country: link.fromCountryCode });
              }
              if (!airportsMap.has(link.toAirportCode)) {
                airportsMap.set(link.toAirportCode, { code: link.toAirportCode, city: link.toAirportCity, country: link.toCountryCode });
              }
            });
          } catch (e) {
            console.error(e);
          }
        }));

        if (airportsMap.size > 0) {
          setAvailableAirports(Array.from(airportsMap.values()));
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadAirports();
  }, []);

  const filteredFrom = availableAirports.filter(a => {
    const searchStr = from.toLowerCase();
    const cityCode = `${a.city} (${a.code})`.toLowerCase();
    return cityCode.includes(searchStr) || a.city.toLowerCase().includes(searchStr) || a.code.toLowerCase().includes(searchStr);
  });
  
  const filteredTo = availableAirports.filter(a => {
    const searchStr = to.toLowerCase();
    const cityCode = `${a.city} (${a.code})`.toLowerCase();
    return cityCode.includes(searchStr) || a.city.toLowerCase().includes(searchStr) || a.code.toLowerCase().includes(searchStr);
  });

  const formatDate = (d: Date | null) => {
    if (!d) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateDisplay = () => {
    if (!departureDate) return 'Add dates';
    if (tripType === 'one') return formatDate(departureDate);
    if (tripType === 'round') {
      return returnDate ? `${formatDate(departureDate)} - ${formatDate(returnDate)}` : `${formatDate(departureDate)} - Return`;
    }
    return 'Add dates';
  };

  // Calendar logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    clickedDate.setHours(0,0,0,0);

    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (clickedDate < today) return; // Cannot select past dates

    if (tripType === 'one') {
      setDepartureDate(clickedDate);
      setIsDatesOpen(false);
    } else {
      if (!departureDate || (departureDate && returnDate)) {
        setDepartureDate(clickedDate);
        setReturnDate(null);
      } else {
        if (clickedDate >= departureDate) {
          setReturnDate(clickedDate);
          setIsDatesOpen(false);
        } else {
          setDepartureDate(clickedDate);
        }
      }
    }
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      date.setHours(0,0,0,0);
      
      const isPast = date < today;
      const isDeparture = departureDate?.getTime() === date.getTime();
      const isReturn = returnDate?.getTime() === date.getTime();
      
      let isBetween = false;
      if (departureDate && returnDate) {
        isBetween = date > departureDate && date < returnDate;
      }

      let classNames = "w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors relative z-10 ";
      
      if (isPast) {
        classNames += "text-neutral-light cursor-not-allowed";
      } else if (isDeparture || isReturn) {
        classNames += "bg-brand-red text-white font-bold cursor-pointer";
      } else if (isBetween) {
        classNames += "bg-brand-red/10 text-brand-red font-medium cursor-pointer rounded-none";
      } else {
        classNames += "text-neutral-black hover:bg-neutral-light/30 cursor-pointer";
      }

      days.push(
        <div key={d} className="relative flex justify-center items-center h-8">
          {isBetween && <div className="absolute inset-0 bg-brand-red/10"></div>}
          {isDeparture && returnDate && <div className="absolute right-0 w-1/2 h-full bg-brand-red/10"></div>}
          {isReturn && departureDate && <div className="absolute left-0 w-1/2 h-full bg-brand-red/10"></div>}
          <div onClick={() => handleDateClick(d)} className={classNames}>
            {d}
          </div>
        </div>
      );
    }

    return days;
  };

  const isSearchDisabled = !from || !to || !departureDate || (tripType === 'round' && !returnDate);

  const containerClasses = compact 
    ? "w-full relative z-10" 
    : "bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 md:p-5 max-w-7xl mx-auto -mt-10 relative z-10 border border-neutral-light/30 backdrop-blur-xl";

  return (
    <div className={containerClasses}>
      <div className={`flex items-center gap-6 border-b border-neutral-light/30 font-ui text-sm ${compact ? 'mb-4 pb-4' : 'mb-4 pb-3'}`}>
        <label className={`flex items-center gap-2 cursor-pointer transition-colors font-medium ${tripType === 'round' ? 'text-brand-red' : 'text-neutral-gray hover:text-neutral-black'}`}>
          <input type="radio" name="flightType" checked={tripType === 'round'} onChange={() => { setTripType('round'); if(!returnDate) setIsDatesOpen(true); }} className="hidden" />
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${tripType === 'round' ? 'border-brand-red' : 'border-neutral-gray'}`}>
            {tripType === 'round' && <div className="w-2 h-2 rounded-full bg-brand-red"></div>}
          </div>
          Round Trip
        </label>
        <label className={`flex items-center gap-2 cursor-pointer transition-colors font-medium ${tripType === 'one' ? 'text-brand-red' : 'text-neutral-gray hover:text-neutral-black'}`}>
          <input type="radio" name="flightType" checked={tripType === 'one'} onChange={() => { setTripType('one'); setReturnDate(null); }} className="hidden" />
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${tripType === 'one' ? 'border-brand-red' : 'border-neutral-gray'}`}>
            {tripType === 'one' && <div className="w-2 h-2 rounded-full bg-brand-red"></div>}
          </div>
          One Way
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_1fr_1fr_auto] gap-3 font-ui items-end">
        <div className="relative group" ref={fromRef}>
          <label className="block text-xs font-bold text-neutral-gray mb-1.5 uppercase tracking-wider">From</label>
          <div className="relative">
            <PlaneTakeoff className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray group-focus-within:text-brand-red transition-colors" />
            <input 
              type="text" 
              value={from}
              onChange={(e) => { setFrom(e.target.value); setIsFromOpen(true); }}
              onFocus={() => setIsFromOpen(true)}
              placeholder="Where from?" 
              className="w-full h-[52px] bg-neutral-light/10 border border-neutral-light/50 rounded-2xl pl-12 pr-4 text-sm font-medium text-neutral-black placeholder-neutral-gray focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
            />
            {isFromOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-neutral-light/30 z-50 overflow-hidden max-h-60 overflow-y-auto">
                {filteredFrom.length > 0 ? filteredFrom.map(airport => (
                  <div 
                    key={airport.code} 
                    className="px-4 py-3 hover:bg-neutral-light/20 cursor-pointer transition-colors flex items-center justify-between"
                    onClick={() => { setFrom(`${airport.city} (${airport.code})`); setIsFromOpen(false); }}
                  >
                    <div>
                      <div className="font-bold text-neutral-black text-sm">{airport.city}</div>
                      <div className="text-xs text-neutral-gray">{airport.country}</div>
                    </div>
                    <div className="text-brand-red font-bold text-sm bg-brand-red/10 px-2 py-1 rounded">{airport.code}</div>
                  </div>
                )) : (
                  <div className="px-4 py-3 text-sm text-neutral-gray">No airports found</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div onClick={handleSwap} className="hidden md:flex mb-[5px] items-center justify-center w-10 h-10 rounded-full bg-neutral-light/20 hover:bg-neutral-light/40 cursor-pointer transition-colors">
          <ArrowRightLeft className="w-4 h-4 text-neutral-gray" />
        </div>
        
        <div className="relative group" ref={toRef}>
          <label className="block text-xs font-bold text-neutral-gray mb-1.5 uppercase tracking-wider">To</label>
          <div className="relative">
            <PlaneLanding className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray group-focus-within:text-brand-red transition-colors" />
            <input 
              type="text" 
              value={to}
              onChange={(e) => { setTo(e.target.value); setIsToOpen(true); }}
              onFocus={() => setIsToOpen(true)}
              placeholder="Where to?" 
              className="w-full h-[52px] bg-neutral-light/10 border border-neutral-light/50 rounded-2xl pl-12 pr-4 text-sm font-medium text-neutral-black placeholder-neutral-gray focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
            />
            {isToOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-neutral-light/30 z-50 overflow-hidden max-h-60 overflow-y-auto">
                {filteredTo.length > 0 ? filteredTo.map(airport => (
                  <div 
                    key={airport.code} 
                    className="px-4 py-3 hover:bg-neutral-light/20 cursor-pointer transition-colors flex items-center justify-between"
                    onClick={() => { setTo(`${airport.city} (${airport.code})`); setIsToOpen(false); }}
                  >
                    <div>
                      <div className="font-bold text-neutral-black text-sm">{airport.city}</div>
                      <div className="text-xs text-neutral-gray">{airport.country}</div>
                    </div>
                    <div className="text-brand-red font-bold text-sm bg-brand-red/10 px-2 py-1 rounded">{airport.code}</div>
                  </div>
                )) : (
                  <div className="px-4 py-3 text-sm text-neutral-gray">No airports found</div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="relative group" ref={datesRef}>
          <label className="block text-xs font-bold text-neutral-gray mb-1.5 uppercase tracking-wider">Dates</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray group-focus-within:text-brand-red transition-colors" />
            <div 
              onClick={() => setIsDatesOpen(!isDatesOpen)}
              className="w-full h-[52px] bg-neutral-light/10 border border-neutral-light/50 rounded-2xl pl-12 pr-4 text-sm font-medium text-neutral-black cursor-pointer hover:border-brand-red/50 transition-all flex items-center justify-between"
            >
              <span className={`truncate select-none ${!departureDate ? 'text-neutral-gray' : 'text-neutral-black'}`}>
                {formatDateDisplay()}
              </span>
            </div>

            {isDatesOpen && (
              <div className="absolute top-full left-0 w-[320px] mt-2 bg-white rounded-3xl shadow-2xl border border-neutral-light/30 z-50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-light/30 transition-colors">
                    <ChevronLeft className="w-5 h-5 text-neutral-black" />
                  </button>
                  <div className="font-bold text-neutral-black">
                    {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </div>
                  <button onClick={handleNextMonth} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-light/30 transition-colors">
                    <ChevronRight className="w-5 h-5 text-neutral-black" />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map(day => (
                    <div key={day} className="text-center text-xs font-bold text-neutral-gray">{day}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-y-1">
                  {renderCalendarDays()}
                </div>
                
                {tripType === 'round' && (
                  <div className="mt-4 pt-4 border-t border-neutral-light/30 flex justify-between items-center text-sm">
                    <div className={departureDate ? 'text-neutral-black font-medium' : 'text-neutral-gray'}>
                      {departureDate ? formatDate(departureDate) : 'Departure'}
                    </div>
                    <div className="w-4 h-[1px] bg-neutral-gray/50"></div>
                    <div className={returnDate ? 'text-neutral-black font-medium' : 'text-neutral-gray'}>
                      {returnDate ? formatDate(returnDate) : 'Return'}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="relative group" ref={travelersRef}>
          <label className="block text-xs font-bold text-neutral-gray mb-1.5 uppercase tracking-wider">Travelers</label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray group-focus-within:text-brand-red transition-colors" />
            <div 
              onClick={() => setIsTravelersOpen(!isTravelersOpen)}
              className="w-full h-[52px] bg-neutral-light/10 border border-neutral-light/50 rounded-2xl pl-12 pr-4 text-sm font-medium text-neutral-black cursor-pointer hover:border-brand-red/50 transition-all flex items-center justify-between"
            >
              <span className="truncate select-none">{persons} Person{persons > 1 ? 's' : ''}, {travelClass}</span>
              <ChevronDown className={`w-4 h-4 text-neutral-gray transition-transform ${isTravelersOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {isTravelersOpen && (
              <div className="absolute top-full left-0 w-72 mt-2 bg-white rounded-2xl shadow-xl border border-neutral-light/30 z-50 p-4">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-light/30">
                  <div>
                    <div className="font-bold text-sm">Persons</div>
                    <div className="text-xs text-neutral-gray">Count of travelers</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => persons > 1 && setPersons(p => p - 1)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border ${persons <= 1 ? 'border-neutral-light text-neutral-gray cursor-not-allowed' : 'border-brand-red text-brand-red hover:bg-brand-red/10'} transition-colors`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold w-4 text-center">{persons}</span>
                    <button 
                      onClick={() => persons < 3 && setPersons(p => p + 1)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border ${persons >= 3 ? 'border-neutral-light text-neutral-gray cursor-not-allowed' : 'border-brand-red text-brand-red hover:bg-brand-red/10'} transition-colors`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <div className="font-bold text-sm mb-2">Class</div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setTravelClass('Economy')}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${travelClass === 'Economy' ? 'bg-brand-red text-white' : 'bg-neutral-light/20 text-neutral-gray hover:bg-neutral-light/40'}`}
                    >
                      Economy
                    </button>
                    <button 
                      onClick={() => setTravelClass('Business')}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${travelClass === 'Business' ? 'bg-[#482AA9] text-white' : 'bg-neutral-light/20 text-neutral-gray hover:bg-neutral-light/40'}`}
                    >
                      Business
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative md:ml-3">
          <Button 
            variant="primary" 
            disabled={isSearchDisabled}
            onClick={() => {
              if (isSearchDisabled) return;
              const query = new URLSearchParams({
                from, to, persons: persons.toString(), class: travelClass, 
                tripType, 
                dep: departureDate ? departureDate.toISOString() : '', 
                ret: returnDate ? returnDate.toISOString() : ''
              });
              router.push(`/search?${query.toString()}`);
            }}
            className={`w-full md:w-auto h-[52px] px-8 text-base font-bold shadow-lg transition-all rounded-2xl ${isSearchDisabled ? 'bg-neutral-light text-neutral-gray shadow-none cursor-not-allowed opacity-70' : 'shadow-brand-red/30 hover:shadow-brand-red/40'}`}
          >
            Search Flights
          </Button>
        </div>
      </div>
    </div>
  );
};
