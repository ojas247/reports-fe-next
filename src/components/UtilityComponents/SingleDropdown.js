// // 'use client';

import { useState } from 'react';
import { useColorModeValue } from '@chakra-ui/react';
import {
  Select,
  Box,
  Text,
} from '@chakra-ui/react';

const SingleDropDown = (props) => {
  const [value, setValue] = useState([]);
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
          placeholder={placeholder}
          onChange={(e) => {
            const selectedOption = {
              value: e.target.value,
              label: e.target.value
            };
            handleSubmit(selectedOption);
          }}
          size="sm"
          width="200px"
          fontSize="12px"
          borderColor="gray.300"
          color="gray.500"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      ) : (
        <Text>Loading...</Text>
      )}
    </Box>
  );
};

export default SingleDropDown;
