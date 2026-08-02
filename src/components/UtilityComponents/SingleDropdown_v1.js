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
    return <div className="w-full h-10 bg-slate-100 rounded animate-pulse" />;
  }

  return (
    <div className="w-full text-sm">
      <Select
        options={options.map((option) => ({ value: option, label: option }))}
        isMulti={props.isMulti ?? false}
        isClearable
        placeholder={props.placeholder || "Select..."}
        onChange={props.onSelect}
        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
        menuPosition="fixed"         
        menuShouldBlockScroll={true}
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 999999,           
          }),
          menu: (base) => ({
            ...base,
            zIndex: 999999,
            marginTop: '4px',
          }),
          control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1',
            boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.15)' : 'none',
            '&:hover': {
              borderColor: '#3b82f6',
            },
          }),
          singleValue: (base) => ({
            ...base,
            color: '#0f172a',
            fontWeight: '500',
          }),
          option: (base, state) => ({
            ...base,
            color: state.isSelected ? '#ffffff' : '#334155',
            backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#f1f5f9' : '#ffffff',
          }),
        }}
      />
    </div>
  );
};

export default SingleDropDown_v1;