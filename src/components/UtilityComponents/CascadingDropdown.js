import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';

const CascadingDropDown = ({ options, onSelect }) => {
  const { sectors, sub1 } = options;

  const [selectedSector, setSelectedSector] = useState('');
  const [selectedSub1, setSelectedSub1] = useState('');

  const handleSectorChange1 = (e) => {
    console.log(e.target.value);
    setSelectedSector(e.target.value);
  }

  const handleSubChange1 = (e) => {
    console.log(e.target.value);
    setSelectedSub1(e.target.value);
  }

  useEffect(() => {
    const sec_options_json = {
      sector: selectedSector,
      sub1: "",
    };
    onSelect(sec_options_json);
  }, [selectedSector]);

  useEffect(() => {
    const sec_options_json = {
      sector: selectedSector,
      sub1: selectedSub1,
    };
    onSelect(sec_options_json);

  }, [selectedSub1]);

  return (
    <>
      <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
        <div className="
    m-2
    w-full sm:w-[190px]
    text-[12px]
    pl-0 sm:pl-[13px]
    flex sm:block
    flex-col sm:flex-row
    min-w-full sm:min-w-[180px]
  ">
          <Select
            placeholder="Select a sector"
            value={selectedSector}
            onChange={handleSectorChange1}
            size="sm"
            width="200px"
            fontSize="12px"
            borderColor="gray.300"
            color="gray.500"
          >
            {sectors.map((sector, index) => (
              <option key={index} value={sector}>
                {sector}
              </option>
            ))}
          </Select>
        </div>

        <div className="
    m-2
    w-full sm:w-[190px]
    text-[12px]
    pl-0 sm:pl-[13px]
    flex sm:block
    flex-col sm:flex-row
    min-w-full sm:min-w-[180px]">
          <Select
            placeholder="Select a Sub-sector"
            value={selectedSub1}
            onChange={handleSubChange1}
            size="sm"
            width="200px"
            fontSize="12px"
            borderColor="gray.300"
            color="gray.500"
          >
            {selectedSector ? (
              sub1[selectedSector]?.map((sub, index) => (
                <option key={index} value={sub}>
                  {sub}
                </option>
              ))
            ) : (
              <option disabled>Select SubSector</option>
            )}
          </Select>
        </div>
      </div>
    </>
  );
}

export default CascadingDropDown;