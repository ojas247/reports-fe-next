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

  const rawOptions = Array.isArray(options)
    ? options
    : options?.options_list || [];

  const selectOptions = rawOptions
    .map((option) => {
      if (typeof option === 'string' || typeof option === 'number') {
        return {
          value: option,
          label: String(option),
        };
      }

      return {
        value:
          option?.value ??
          option?.name ??
          option?.label ??
          '',
        label:
          option?.label ??
          option?.name ??
          option?.value ??
          '',
      };
    })
    .filter((option) => option.value !== '');

  // Convert parent's value into react-select option object
  const selectedValue = isMulti
    ? Array.isArray(value)
      ? value
          .map((item) => {
            // Already an option object
            if (typeof item === 'object' && item !== null) {
              return (
                selectOptions.find(
                  (option) =>
                    String(option.value) === String(item.value)
                ) || item
              );
            }

            // Primitive value
            return selectOptions.find(
              (option) =>
                String(option.value) === String(item)
            );
          })
          .filter(Boolean)
      : []
    : (() => {
        if (value === null || value === undefined || value === '') {
          return null;
        }

        // Already an option object
        if (typeof value === 'object') {
          return (
            selectOptions.find(
              (option) =>
                String(option.value) === String(value.value)
            ) || value
          );
        }

        // Primitive value such as "India"
        return (
          selectOptions.find(
            (option) =>
              String(option.value) === String(value)
          ) || null
        );
      })();

  return (
    <div className="w-full min-w-0">
      <Select
        options={selectOptions}

        isMulti={isMulti}

        value={selectedValue}

        onChange={(selected) => {
          if (isMulti) {
            onSelect?.(selected || []);
          } else {
            onSelect?.(selected);
          }
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

          singleValue: (base) => ({
            ...base,
            fontSize: '11px',
            color: '#0f172a',
          }),

          placeholder: (base) => ({
            ...base,
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