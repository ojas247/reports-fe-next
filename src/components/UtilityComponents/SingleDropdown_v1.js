'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';

const SingleDropDown_v1 = (props) => {
  const options = props.options?.options_list || [];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[42px] bg-slate-100 rounded-xl animate-pulse" />
    );
  }

  return (
    <div className="w-full text-sm">
      <Select
        options={options.map((option) => ({
          value: option,
          label: option,
        }))}
        isMulti={props.isMulti ?? false}
        isClearable
        placeholder={props.placeholder || 'Select...'}
        onChange={props.onSelect}
        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
        menuPosition="fixed"
        menuShouldBlockScroll={true}
        classNamePrefix="react-select"
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 999999,
          }),
          menu: (base) => ({
            ...base,
            zIndex: 999999,
            marginTop: 6,
            borderRadius: 10,
            boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }),
          control: (base, state) => ({
            ...base,
            minHeight: 42,
            height: 42,
            borderRadius: 10,
            borderColor: state.isFocused ? '#3b82f6' : '#e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: state.isFocused
              ? '0 0 0 3px rgba(59, 130, 246, 0.15)'
              : '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            '&:hover': {
              borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1',
            },
            transition: 'all 0.15s ease',
            cursor: 'pointer',
          }),
          valueContainer: (base) => ({
            ...base,
            padding: '0 12px',
          }),
          singleValue: (base) => ({
            ...base,
            color: '#0f172a',
            fontWeight: 500,
            fontSize: '0.875rem',
          }),
          placeholder: (base) => ({
            ...base,
            color: '#94a3b8',
            fontSize: '0.875rem',
          }),
          input: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
          }),
          indicatorsContainer: (base) => ({
            ...base,
            height: 42,
          }),
          dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? '#3b82f6' : '#94a3b8',
            padding: '0 10px',
            '&:hover': {
              color: '#3b82f6',
            },
          }),
          clearIndicator: (base) => ({
            ...base,
            color: '#94a3b8',
            padding: '0 4px',
            '&:hover': {
              color: '#ef4444',
            },
          }),
          indicatorSeparator: () => ({
            display: 'none',
          }),
          option: (base, state) => ({
            ...base,
            fontSize: '0.875rem',
            padding: '10px 14px',
            color: state.isSelected ? '#ffffff' : '#334155',
            backgroundColor: state.isSelected
              ? '#2563eb'
              : state.isFocused
              ? '#f1f5f9'
              : '#ffffff',
            cursor: 'pointer',
            '&:active': {
              backgroundColor: state.isSelected ? '#1d4ed8' : '#e2e8f0',
            },
          }),
        }}
      />
    </div>
  );
};

export default SingleDropDown_v1;