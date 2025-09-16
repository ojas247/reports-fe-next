 'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';

const SingleDropDown_v1 = (props) => {
  const options = props.options.options_list;
  const placeholder = props.placeholder;


  const handleSubmit = (e) => {
    props.onSelect(e);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    // Force SSR + first render to always match
    return (
      <div className="m-2 w-full sm:w-[190px] text-[12px]">
        <p>Loading...</p>
      </div>
    );
  }


  return (
    <div
      className="
        m-2
        w-full sm:w-[190px]
        text-[12px]
        pl-0 sm:pl-[13px]
        flex sm:block
        flex-col sm:flex-row
        min-w-full sm:min-w-[180px]"
    >
      <Select
        options={
          options
            ? options.map((option) => ({
                value: option,
                label: option,
              }))
            : []
        }
        isMulti={false}
        isClearable
        placeholder={placeholder}
        className="w-50 text-sm"
        isLoading={!options}  // 🔥 shows loading indicator
        noOptionsMessage={() =>
          !options ? "Loading..." : "No options available"
        } // custom loading message
        onChange={(selectedOption) => {
          handleSubmit(selectedOption);
        }}
      />
    </div>
  );
};

export default SingleDropDown_v1;
