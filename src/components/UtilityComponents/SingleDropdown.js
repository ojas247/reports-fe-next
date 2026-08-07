// // 'use client';

import { useState } from 'react';
import Select from 'react-select';

const SingleDropDown = (props) => {
  const options = props.options.options_list;
  const placeholder = props.placeholder;


  const handleSubmit = (e) => {
    props.onSelect(e);
  };


  return (
    <div className="w-full min-w-0">
      {options ? (
        <Select
          options={options.map((option, index) => ({
            value: option,
            label: option
          }))}
          isMulti={props.isMulti}
          placeholder={placeholder}
          className="w-full text-sm"
          onChange={(selectedOptions) => { handleSubmit(selectedOptions); }}
        />
      ) : (
        <div className="flex items-center justify-center h-12 rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
          <i className="bi bi-exclamation-diamond text-lg"></i>
        </div>
      )}
    </div>
  );
};

export default SingleDropDown;
