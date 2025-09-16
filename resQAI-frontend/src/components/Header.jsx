// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Siren, Truck, PlusCircle } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Header({ resources, incidents, onNewIncidentClick }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const deployedCount = resources.filter(r => r.status === 'On Scene' || r.status === 'En Route').length;
  const totalCount = resources.length;
  const activeIncidentCount = Object.keys(incidents).length;

  return (
    <header className="flex-shrink-0 flex flex-wrap items-center justify-between h-auto sm:h-16 px-4 sm:px-6 py-2 sm:py-0 bg-white border-b border-gray-200 z-20 relative gap-4">
      <div className="flex items-center gap-2 sm:gap-4">
        <img src={logo} className='h-8 sm:h-12 w-auto' alt="logo" />
        <div className="font-mono text-gray-500 text-sm sm:text-base">
          {time.toLocaleTimeString('en-GB')} IST
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Siren className="text-black" size={20} />
          <span className="text-black">Active Incidents:</span>
          <strong className="text-black text-lg">{activeIncidentCount}</strong>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="text-black" size={20} />
          <span className="text-black">Resources Deployed:</span>
          <strong className="text-lg text-black">{deployedCount} / {totalCount}</strong>
        </div>
      </div>

      <button
        onClick={onNewIncidentClick}
        className="flex items-center gap-2 bg-black text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm"
      >
        <PlusCircle size={16} />
        New Incident
      </button>
    </header>
  );
}