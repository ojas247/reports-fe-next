import React from "react";

const TextWithTitle = ({ title, text }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-700">{text}</p>
    </div>
  );
};

export default TextWithTitle;
