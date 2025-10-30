'use client';
import React, { useEffect, useState } from "react";
import SingleDropDown_v1 from "@/components/UtilityComponents/SingleDropdown_v1";

export default function SectorHierarchyDropDown(props) {
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
    const [dropdowns, setDropdowns] = useState([
      { level: "Sector", options_list: [] },
    ]);
    const [selectedPath, setSelectedPath] = useState([]);
  
    // Fetch items from backend
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
  
    // Load top-level Sectors on mount
    useEffect(() => {
      const loadSectors = async () => {
        const sectors = await fetchItems(); // empty payload fetches sectors
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
      
  
    // Handle selection in any dropdown
    const handleSelect = async (levelIndex, selected) => {
        const chosenValue = selected ? selected.value : null;
      
        if (!chosenValue) {
          // Handle clear
          const newDropdowns = dropdowns.slice(0, Math.max(levelIndex, 1)); 
          const newPath = selectedPath.slice(0, Math.max(levelIndex, 1));
          setDropdowns(newDropdowns);
          setSelectedPath(newPath);
          return;
        }
      
        // Update path
        const newPath = [...selectedPath];
        newPath[levelIndex] = chosenValue;
        setSelectedPath(newPath);
      
        // Reset deeper dropdowns if higher one changes
        const newDropdowns = dropdowns.slice(0, levelIndex + 1);
      
        // Parent info
        const parent = newDropdowns[levelIndex];
        const parentKind = parent.level;
        const parentName = chosenValue;
        const parentPath = newPath
          .slice(0, -1)
          .map((name, idx) => `${dropdowns[idx].level}/${name}`)
          .join("/");
      
        // Ask backend what children exist
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
      <div className="p-4">
        <h2 className="block text-sm font-medium text-gray-600 mb-1 sm:px-6">Sector Hierarchy Dropdowns</h2>
  
        <div className="flex flex-row flex-wrap px-0 py-2" >
          {dropdowns.map((dropdown, idx) => (
            <SingleDropDown_v1
              key={idx}
              options={{ options_list: dropdown.options_list }}
              placeholder={`Select ${dropdown.level}`}
              onSelect={(selected) => handleSelect(idx, selected)}
            />
          ))}
        </div>
  
        <div className="mt-4 text-sm text-gray-700">
          <strong>Selected Sector:</strong>{" "}
          {selectedPath
            .map((p, i) =>
              dropdowns[i] ? `${p}` : p
            )
            .join(" > ")}
        </div>
      </div>
    );
  
}
