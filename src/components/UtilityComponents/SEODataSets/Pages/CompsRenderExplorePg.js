import React from "react";
import TextWithTitle from "../../SEODataSets/Pages/Comps/TextWithTitle";
import TextWithGrid from "../../SEODataSets/Pages/Comps/TextWithGrid";
import PageHeader from "../../SEODataSets/Pages/Comps/PageHeader";

const CompsRenderExplorePg = ({ pageCompArray }) => {
    console.log("Check00: ", pageCompArray)
    
  return (
    <div className="container mx-auto p-4">
      {pageCompArray.map((comp, index) => {
        // comp.compData can be a JSON string or object
        let data = comp.compData;
        if (typeof data === "string") {
          try {
            data = JSON.parse(data); // safely parse JSON strings
          } catch (e) {
            console.warn("Invalid JSON string in compData:", data);
          }
        }

        // render based on compName
        switch (comp.compName) {
          case "pageHeader":
            return (
              <PageHeader
                key={index}
                {...data} // pass fields like pageName, pageDataDesc etc
              />
            );

          case "txtWithTitle":
            return (
              <TextWithTitle
                key={index}
                title={data.title}
                text={data.text}
              />
            );

          case "txtGrid":
            return (
              <TextWithGrid
                key={index}
                {...data} // spread props like dataName, tableData, etc.
              />
            );

          default:
            return (
              <div key={index} className="text-red-500">
                Unknown Component: {comp.compName}
              </div>
            );
        }
      })}
    </div>
  );
};

export default CompsRenderExplorePg;
