'use client';
import React, { useEffect, useState, useRef } from "react";
import SingleDropDown_v1 from "@/components/UtilityComponents/SingleDropdown_v1";

export default function SectorHierarchyDropDown(props) {
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
    const [dropdowns, setDropdowns] = useState([
      { level: "Sector", options_list: [] },
    ]);
    const [selectedPath, setSelectedPath] = useState([]);
    const [selectedValues, setSelectedValues] = useState({});
    const isResetting = useRef(false);
  
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
  
    // Reset function to clear all selections
    const resetHierarchy = () => {
      isResetting.current = true;
      setDropdowns([{ level: "Sector", options_list: dropdowns[0]?.options_list || [] }]);
      setSelectedPath([]);
      setSelectedValues({});
      // Send empty sector filters to parent
      props.onSelect({});
      setTimeout(() => {
        isResetting.current = false;
      }, 100);
    };

    // Expose reset method to parent via ref or callback
    useEffect(() => {
      if (props.resetRef) {
        props.resetRef.current = resetHierarchy;
      }
    }, []);

    // Load sectors on mount
    useEffect(() => {
      const loadSectors = async () => {
        const sectors = await fetchItems();
        setDropdowns([{ level: "Sector", options_list: sectors }]);
        setSelectedPath([]);
        setSelectedValues({});
      };
      loadSectors();
    }, []);

    // Send selected path to parent when it changes
    useEffect(() => {
      if (isResetting.current) return;
      
      const pathObject = {};
      selectedPath.forEach((selectedValue, idx) => {
        if (dropdowns[idx]) {
          const levelName = dropdowns[idx].level;
          pathObject[levelName] = selectedValue;
        }
      });
      
      // Only send if there are selections
      if (Object.keys(pathObject).length > 0) {
        props.onSelect(pathObject);
      }
    }, [dropdowns, selectedPath]);
      
    const handleSelect = async (levelIndex, selected) => {
      if (isResetting.current) return;
      
      const chosenValue = selected ? selected.value : null;
      
      // Update selected values
      setSelectedValues(prev => ({
        ...prev,
        [levelIndex]: chosenValue
      }));
      
      if (!chosenValue) {
        // If clearing a selection, remove all dropdowns after this level
        const newDropdowns = dropdowns.slice(0, Math.max(levelIndex + 1, 1)); 
        const newPath = selectedPath.slice(0, Math.max(levelIndex, 0));
        
        // Keep the first dropdown if it's the only one
        if (newDropdowns.length === 0) {
          newDropdowns.push({ level: "Sector", options_list: dropdowns[0]?.options_list || [] });
        }
        
        setDropdowns(newDropdowns);
        setSelectedPath(newPath);
        
        // Send updated path to parent
        const pathObject = {};
        newPath.forEach((val, idx) => {
          if (newDropdowns[idx]) {
            const levelName = newDropdowns[idx].level;
            pathObject[levelName] = val;
          }
        });
        
        if (Object.keys(pathObject).length > 0) {
          props.onSelect(pathObject);
        } else {
          props.onSelect({});
        }
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
    
    // Reset when props.reset is triggered from parent
    useEffect(() => {
      if (props.reset) {
        resetHierarchy();
      }
    }, [props.reset]);
      
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
                value={selectedValues[idx] || null}
                onSelect={(selected) => handleSelect(idx, { value: selected, label: selected })}
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