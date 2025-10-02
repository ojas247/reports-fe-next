import React from "react";

const PageHeader = ({ PageName, pageDataDesc, pageSeoDesc, sectorChain, tags }) => {
    // console.log("Check01: ", PageName, pageDataDesc, pageSeoDesc, sectorChain, tags)
  return (
    <div className="p-4 ">
     <h1 className="text-2xl font-bold text-blue-900">{PageName}</h1>
      <p className="text-black-600">{pageDataDesc}</p>

      {/* <p className="text-gray-500 italic">{pageSeoDesc}</p> */} 
      {/* {sectorChain && (
        <p className="mt-2 text-sm text-gray-700">Sector: {JSON.stringify(sectorChain)}</p>
      )} */}
      {/* {tags && <p className="mt-1 text-sm text-gray-700">Tags: {tags.join(", ")}</p>} */}
    </div>
  );
};

export default PageHeader;
