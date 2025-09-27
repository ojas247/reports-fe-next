import React from "react";
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import { HotTable } from '@handsontable/react-wrapper';

const TextWithGrid = ({ dataName, units, tableData = [] }) => {
  return (
    <div className="p-4 rounded-lg overflow-x-auto">
      <h3 className="text-lg font-bold mb-2">
        {dataName} ({units})
      </h3>
      <HotTable
        data={tableData}              // list of lists
        colHeaders={false}        // show headers
        rowHeaders={false}        // show row numbers
        licenseKey="non-commercial-and-evaluation"  // required
       
        stretchH="none"
      />
    </div>
  );
};

export default TextWithGrid;
