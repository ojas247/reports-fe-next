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
    <div
      className="
      m-2
      w-full sm:w-[190px]
      text-[12px]
      pl-0 sm:pl-[13px]
      flex sm:block
      flex-col sm:flex-row
      min-w-full sm:min-w-[180px]">
      {options ? (
        <Select
          options={options.map((option, index) => ({
            value: option,
            label: option
          }))}
          isMulti={props.isMulti}
          placeholder={placeholder}
          className="w-50 text-sm"
          onChange={(selectedOptions) => { handleSubmit(selectedOptions); }}
        // value={props.selectedValue ? props.selectedValue : null}
        />
      ) : (
        // <p>Loading...</p>
        <p>
          <i className="bi bi-exclamation-diamond text-xl sm:text-2xl lg:text-3xl px-6"></i>
        </p>

      )}

    </div>
  );
};

export default SingleDropDown;
