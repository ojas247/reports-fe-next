'use client';
import React, { useEffect, useState } from "react";
import SingleDropDown_v1 from "@/components/UtilityComponents/SingleDropdown_v1";

export default function SectorHierarchyDropDown(props) {
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
    const [dropdowns, setDropdowns] = useState([
      { level: "Sector", options_list: [] },
    ]);
    const [selectedPath, setSelectedPath] = useState([]);
  
    const fetchItems = async (parentKind, parentName, parentPath, childKind) => {
      let payload = {};
  
      if (parentKind && parentName && childKind) {
        payload = { parentKind, parentName, childKind };
        if (parentPath) payload.parentPath = parentPath;
      }
  
      const res = await fetch(`${backendAPI}/HierarchyControllerGet`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      return data.items?.map((item) => item.name) || [];
    };
  
    useEffect(() => {
      const loadSectors = async () => {
        const sectors = await fetchItems();
        setDropdowns([{ level: "Sector", options_list: sectors }]);
        setSelectedPath([]);
      };
      loadSectors();
    }, []);

    useEffect(() => {
        const pathObject = {};
        selectedPath.forEach((selectedValue, idx) => {
          if (dropdowns[idx]) {
            const levelName = dropdowns[idx].level;
            pathObject[levelName] = selectedValue;
          }
        });
        props.onSelect(pathObject);
      }, [dropdowns, selectedPath]);
      
    const handleSelect = async (levelIndex, selected) => {
        const chosenValue = selected ? selected.value : null;
      
        if (!chosenValue) {
          const newDropdowns = dropdowns.slice(0, Math.max(levelIndex, 1)); 
          const newPath = selectedPath.slice(0, Math.max(levelIndex, 1));
          setDropdowns(newDropdowns);
          setSelectedPath(newPath);
          return;
        }
      
        const newPath = [...selectedPath];
        newPath[levelIndex] = chosenValue;
        setSelectedPath(newPath);
      
        const newDropdowns = dropdowns.slice(0, levelIndex + 1);
      
        const parent = newDropdowns[levelIndex];
        const parentKind = parent.level;
        const parentName = chosenValue;
        const parentPath = newPath
          .slice(0, -1)
          .map((name, idx) => `${dropdowns[idx].level}/${name}`)
          .join("/");
      
        const childKind =
          levelIndex === 0 ? "Sub1" : `Sub${levelIndex + 1}`;
      
        const children = await fetchItems(
          parentKind,
          parentName,
          parentPath,
          childKind
        );
      
        if (children.length > 0) {
          newDropdowns.push({
            level: childKind,
            options_list: children,
          });
        }
      
        setDropdowns(newDropdowns);
      };
      
    return (
      <div className="w-full">
        <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-600 mb-3">
          Taxonomy Hierarchy
        </h2>
  
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          {dropdowns.map((dropdown, idx) => (
            <div key={idx} className="w-full sm:flex-1 min-w-[140px]">
              <SingleDropDown_v1
                options={{ options_list: dropdown.options_list }}
                placeholder={`Select ${dropdown.level}`}
                onSelect={(selected) => handleSelect(idx, selected)}
              />
            </div>
          ))}
        </div>
  
        <div className="mt-4 text-xs text-slate-500 font-mono">
          <span className="font-semibold text-slate-700">Selected Path:</span>{" "}
          {selectedPath.length > 0 ? (
            selectedPath
              .map((p, i) =>
                dropdowns[i] ? `${p}` : p
              )
              .join(" › ")
          ) : (
            <span className="text-slate-400">No selection</span>
          )}
        </div>
      </div>
    );
}