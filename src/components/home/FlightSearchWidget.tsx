'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export const FlightSearchWidget = () => {
  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 md:p-6 max-w-7xl mx-auto -mt-10 relative z-10 border border-neutral-light/20">
      <div className="flex items-center gap-6 mb-4 border-b border-neutral-light/30 pb-3 font-ui text-sm">
        <label className="flex items-center gap-2 cursor-pointer text-brand-red font-medium">
          <input type="radio" name="flightType" defaultChecked className="accent-brand-red" />
          Round Trip
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-neutral-gray hover:text-brand-red transition-colors">
          <input type="radio" name="flightType" className="accent-brand-red" />
          One Way
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-ui items-end">
        <div className="relative">
          <label className="block text-[10px] font-semibold text-neutral-gray mb-1 uppercase tracking-wide">From</label>
          <input 
            type="text" 
            placeholder="Moscow (SVO)" 
            className="w-full bg-neutral-light/10 border border-neutral-light/50 rounded-lg px-3 py-2 text-sm text-neutral-black placeholder-neutral-gray focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
          />
        </div>
        
        <div className="relative">
          <label className="block text-[10px] font-semibold text-neutral-gray mb-1 uppercase tracking-wide">To</label>
          <input 
            type="text" 
            placeholder="Zurich (ZRH)" 
            className="w-full bg-neutral-light/10 border border-neutral-light/50 rounded-lg px-3 py-2 text-sm text-neutral-black placeholder-neutral-gray focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
          />
        </div>
        
        <div className="relative">
          <label className="block text-[10px] font-semibold text-neutral-gray mb-1 uppercase tracking-wide">Dates</label>
          <input 
            type="text" 
            placeholder="Add dates" 
            className="w-full bg-neutral-light/10 border border-neutral-light/50 rounded-lg px-3 py-2 text-sm text-neutral-black placeholder-neutral-gray focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
          />
        </div>
        
        <div className="relative">
          <label className="block text-[10px] font-semibold text-neutral-gray mb-1 uppercase tracking-wide">Passengers & Class</label>
          <input 
            type="text" 
            placeholder="1 Adult, Economy" 
            className="w-full bg-neutral-light/10 border border-neutral-light/50 rounded-lg px-3 py-2 text-sm text-neutral-black placeholder-neutral-gray focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
          />
        </div>

        <div className="relative">
          <Button variant="primary" className="w-full py-2 text-sm">
            Search Flights
          </Button>
        </div>
      </div>
    </div>
  );
};
