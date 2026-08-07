'use client';

import React, { useState, useEffect } from 'react';

const CascadingDropDown = ({ options, onSelect }) => {
  const { sectors = [], sub1 = {} } = options || {};
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedSub1, setSelectedSub1] = useState('');

  const handleSectorChange = (e) => {
    const value = e.target.value;
    setSelectedSector(value);
    setSelectedSub1(''); // reset sub-sector
  };

  const handleSubChange = (e) => {
    setSelectedSub1(e.target.value);
  };

  useEffect(() => {
    onSelect({
      sector: selectedSector,
      sub1: selectedSub1,
    });
  }, [selectedSector, selectedSub1]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Sector */}
      <div className="flex-1">
        <select
          value={selectedSector}
          onChange={handleSectorChange}
          className="w-full h-9 text-xs border border-slate-200 bg-white text-slate-700 rounded-lg px-3 focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
        >
          <option value="" disabled>
            Select Sector
          </option>
          {sectors.map((sector, index) => (
            <option key={index} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </div>

      {/* Sub-Sector */}
      <div className="flex-1">
        <select
          value={selectedSub1}
          onChange={handleSubChange}
          disabled={!selectedSector}
          className="w-full h-9 text-xs border border-slate-200 bg-white text-slate-700 rounded-lg px-3 focus:outline-none focus:ring-1 focus:ring-slate-400 transition disabled:bg-slate-50 disabled:text-slate-400"
        >
          <option value="" disabled>
            Select Sub-Sector
          </option>
          {selectedSector &&
            sub1[selectedSector]?.map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default CascadingDropDown;