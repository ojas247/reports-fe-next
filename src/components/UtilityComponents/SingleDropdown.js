'use client';

import React from 'react';
import Select from 'react-select';

const SingleDropDown = ({
  options = [],
  isMulti = false,
  placeholder = 'Select...',
  value,
  onSelect,
}) => {

  // Support both:
  // options={[...]}
  // and
  // options={{ options_list: [...] }}

  const rawOptions = Array.isArray(options)
    ? options
    : options?.options_list || [];

  const selectOptions = rawOptions.map((option) => {

    if (typeof option === 'string') {
      return {
        value: option,
        label: option,
      };
    }

    return {
      value:
        option?.value ||
        option?.name ||
        option?.label ||
        '',
      label:
        option?.label ||
        option?.name ||
        option?.value ||
        '',
    };
  }).filter((option) => option.value);

  return (
    <div className="w-full min-w-0">

      <Select
        options={selectOptions}

        isMulti={isMulti}

        value={value || (isMulti ? [] : null)}

        onChange={(selected) => {
          onSelect?.(selected);
        }}

        placeholder={placeholder}

        isClearable

        closeMenuOnSelect={!isMulti}

        hideSelectedOptions={false}

        className="w-full text-sm"

        classNamePrefix="market-select"

        styles={{
          control: (base) => ({
            ...base,
            minHeight: '38px',
            borderColor: '#e2e8f0',
            boxShadow: 'none',
            fontSize: '11px',
          }),

          multiValue: (base) => ({
            ...base,
            fontSize: '10px',
          }),

          multiValueLabel: (base) => ({
            ...base,
            fontSize: '10px',
          }),

          option: (base) => ({
            ...base,
            fontSize: '11px',
          }),
        }}
      />

    </div>
  );
};

export default SingleDropDown;