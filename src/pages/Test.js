import React, { useEffect, useState } from "react";
import SingleDropDown_v1 from "@/components/UtilityComponents/SingleDropdown_v1";



export default function HierarchyManager() {
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

  // Handle selection in any dropdown
  const handleSelect = async (levelIndex, selected) => {
    const chosenValue = selected?.value; // single selection
    let newPath = [...selectedPath];
    let newDropdowns = dropdowns.slice(0, levelIndex + 1);

    if (!chosenValue) {
      // user cleared the selection → remove deeper dropdowns and path
      newDropdowns = dropdowns.slice(0, levelIndex);
      newPath = selectedPath.slice(0, levelIndex);
      setDropdowns(newDropdowns);
      setSelectedPath(newPath);
      return;
    }

    // update path
    newPath[levelIndex] = chosenValue;
    newPath = newPath.slice(0, levelIndex + 1);

    // figure out parent info
    const parent = newDropdowns[levelIndex];
    const parentKind = parent.level;
    const parentName = chosenValue;
    const parentPath = newPath
      .slice(0, -1)
      .map((name, idx) => `${dropdowns[idx].level}/${name}`)
      .join("/");

    // determine child kind (simple convention)
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
    setSelectedPath(newPath);
  };

  return (
    <div className="p-4">
      <h2 className="font-bold mb-2">Dynamic Hierarchy Dropdowns</h2>

      <div className="flex flex-row gap-4">
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
        <strong>Selected Path:</strong>{" "}
        {selectedPath
          .map((p, i) =>
            dropdowns[i] ? `${dropdowns[i].level}:${p}` : p
          )
          .join(" > ")}
      </div>
    </div>
  );
}