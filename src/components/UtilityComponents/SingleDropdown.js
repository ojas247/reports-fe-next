'use client';

import React, { useMemo } from 'react';
import Select from 'react-select';

const SingleDropDown = ({
  options = [],
  isMulti = false,
  placeholder = 'Select...',
  value,
  onSelect,
}) => {
  // Normalize every possible API response shape
  const rawOptions = useMemo(() => {
    if (Array.isArray(options)) {
      return options;
    }

    if (Array.isArray(options?.options_list)) {
      return options.options_list;
    }

    if (Array.isArray(options?.data)) {
      return options.data;
    }

    if (Array.isArray(options?.authors)) {
      return options.authors;
    }

    if (Array.isArray(options?.tags)) {
      return options.tags;
    }

    if (Array.isArray(options?.items)) {
      return options.items;
    }

    if (Array.isArray(options?.datasets)) {
      return options.datasets;
    }

    return [];
  }, [options]);

  // Convert API values into react-select format
  const selectOptions = useMemo(() => {
    return rawOptions
      .map((option) => {
        // String / number
        if (
          typeof option === 'string' ||
          typeof option === 'number'
        ) {
          return {
            value: String(option),
            label: String(option),
          };
        }

        // Object
        if (option && typeof option === 'object') {
          const value =
            option.value ??
            option.id ??
            option._id ??
            option.name ??
            option.label ??
            option.displayName ??
            option.display_name ??
            '';

          const label =
            option.label ??
            option.name ??
            option.displayName ??
            option.display_name ??
            option.value ??
            option.id ??
            option._id ??
            '';

          if (value === '' || label === '') {
            return null;
          }

          return {
            ...option,
            value: String(value),
            label: String(label),
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [rawOptions]);

  // Convert parent's value into react-select's expected object
  const selectedValue = useMemo(() => {
    if (isMulti) {
      if (!Array.isArray(value)) {
        return [];
      }

      return value
        .map((item) => {
          const itemValue =
            typeof item === 'object' && item !== null
              ? item.value ??
                item.id ??
                item._id ??
                item.name ??
                item.label
              : item;

          return selectOptions.find(
            (option) =>
              String(option.value) === String(itemValue)
          );
        })
        .filter(Boolean);
    }

    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return null;
    }

    const itemValue =
      typeof value === 'object' && value !== null
        ? value.value ??
          value.id ??
          value._id ??
          value.name ??
          value.label
        : value;

    return (
      selectOptions.find(
        (option) =>
          String(option.value) === String(itemValue)
      ) || null
    );
  }, [value, selectOptions, isMulti]);

  return (
    <div className="w-full min-w-0 relative z-[100]">

      <Select
        options={selectOptions}

        isMulti={isMulti}

        value={selectedValue}

        onChange={(selected) => {
          console.log(
            'SingleDropDown selected:',
            selected
          );

          if (isMulti) {
            onSelect?.(selected || []);
          } else {
            onSelect?.(selected || null);
          }
        }}

        placeholder={placeholder}

        isClearable

        closeMenuOnSelect={!isMulti}

        hideSelectedOptions={false}

        menuPortalTarget={
          typeof document !== 'undefined'
            ? document.body
            : null
        }

        menuPosition="fixed"

        menuPlacement="auto"

        className="w-full text-sm"

        classNamePrefix="market-select"

        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: '38px',
            borderColor: state.isFocused
              ? '#94a3b8'
              : '#e2e8f0',
            boxShadow: 'none',
            fontSize: '11px',
            cursor: 'pointer',
            backgroundColor: '#ffffff',

            '&:hover': {
              borderColor: '#cbd5e1',
            },
          }),

          valueContainer: (base) => ({
            ...base,
            cursor: 'pointer',
          }),

          singleValue: (base) => ({
            ...base,
            fontSize: '11px',
            color: '#0f172a',
          }),

          placeholder: (base) => ({
            ...base,
            fontSize: '11px',
            color: '#94a3b8',
          }),

          multiValue: (base) => ({
            ...base,
            fontSize: '10px',
          }),

          multiValueLabel: (base) => ({
            ...base,
            fontSize: '10px',
          }),

          option: (base, state) => ({
            ...base,
            fontSize: '11px',
            cursor: 'pointer',
            backgroundColor: state.isSelected
              ? '#e2e8f0'
              : state.isFocused
                ? '#f1f5f9'
                : '#ffffff',
            color: '#0f172a',

            '&:active': {
              backgroundColor: '#cbd5e1',
            },
          }),

          menu: (base) => ({
            ...base,
            zIndex: 999999,
          }),

          menuPortal: (base) => ({
            ...base,
            zIndex: 999999,
          }),
        }}
      />

      {/* Temporary debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-[8px] text-slate-400 mt-1">
          OPTIONS: {selectOptions.length}
        </div>
      )}
    </div>
  );
};

export default SingleDropDown;