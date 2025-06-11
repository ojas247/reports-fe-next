import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Select } from "@chakra-ui/react";

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
      <div className="flex flex-col gap-0 sm:flex-row sm:gap-0">
        <Box 
          m={2}
          w={{ base: '100%', sm: '190px' }}
          fontSize="12px"
          pl={{ base: 0, sm: '13px' }}
          display={{ base: 'flex', sm: 'block' }}
          flexDirection={{ base: 'column', sm: 'row' }}
          minW={{ base: '100%', sm: '180px' }}
        >
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
        </Box>

        <Box 
          m={2}
          w={{ base: '100%', sm: '190px' }}
          fontSize="12px"
          pl={{ base: 0, sm: '13px' }}
          display={{ base: 'flex', sm: 'block' }}
          flexDirection={{ base: 'column', sm: 'row' }}
          minW={{ base: '100%', sm: '180px' }}
        >
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
        </Box>
      </div>
    </>
  );
}

export default CascadingDropDown;