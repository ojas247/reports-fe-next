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
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SingleDropDown;
