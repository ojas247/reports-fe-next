// // 'use client';

import { useState } from 'react';
import Select from 'react-select';
import { useColorModeValue } from '@chakra-ui/react';
import {
  // Select,
  Box,
  Text,
} from '@chakra-ui/react';

const SingleDropDown = (props) => {
  const options = props.options.options_list;
  const placeholder = props.placeholder;

  const handleSubmit = (e) => {
    props.onSelect(e);
  };


  return (
    <Box
      m={2}
      w={{ base: '100%', sm: '190px' }}
      fontSize="12px"
      pl={{ base: 0, sm: '13px' }}
      display={{ base: 'flex', sm: 'block' }}
      flexDirection={{ base: 'column', sm: 'row' }}
      minW={{ base: '100%', sm: '180px' }}
    >
      {options ? (
        <Select
          options={options.map((option, index) => ({
            value: option,
            label: option
          }))}
          defaultValue="All" placeholder={placeholder}
          onChange={(selectedOption) => {
            //  OptionsValue(selectedOption);
            handleSubmit(selectedOption); // Call handleSubmit on option selection
          }}
          isMulti
          isSearchable
          noOptionsMessage={() => "More ComingSoon"}
          styles={{
            placeholder: (baseStyles, state) => ({
              ...baseStyles,
              color: "grey"
            }),
            clearIndicator: () => ({
              color: "red"
            }),
            option: (base, state) => ({
              ...base,
              padding: "5px", // Adjust the padding to reduce the gap between text
            })
          }} />
      ) : (
        <Text>Loading...</Text>
      )}
    </Box>
  );
};

export default SingleDropDown;
