import React, { useEffect, useState } from "react";

export default function HierarchyManager() {
  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
  const [items, setItems] = useState([]);
  const [level, setLevel] = useState("Sector");
  const [path, setPath] = useState([]);
  const [newName, setNewName] = useState("");
  const [childKind, setChildKind] = useState("");
  const [getPath, setGetPath] = useState([]);
const [postPath, setPostPath] = useState([]);

  // Fetch hierarchy
  const fetchItems = async (parentKind, parentName, parentPath, childKind) => {
    // Reset state when fetching root level
    if (!parentKind) {
      setPath([]);
      setLevel("Sector");
    }

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
    setItems(data.items || []);
    setLevel(data.level || (parentKind ? parentKind : "Sector"));
  };


  // Initial load: fetch top-level sectors
  useEffect(() => {
    fetchItems();
  }, []);

  // Add a new entity
  const addItem = async () => {
    if (!newName) return alert("Enter a name");
  
    let payload = {
      kind: level,
      name: newName,
    };
    if (childKind) payload.childKind = childKind;
  
    if (postPath.length > 0) {
      payload.parentPath = postPath.map((p) => `${p.kind}/${p.name}`).join("/");
    }
  
    await fetch(`${backendAPI}/HierarchyController`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  
    setNewName("");
  
    const last = postPath[postPath.length - 1];
    fetchItems(
      last ? last.kind : null,
      last ? last.name : null,
      getPath.map((p) => `${p.kind}/${p.name}`).join("/"),
      childKind
    );
  };
  
  // Navigate into children
const handleClick = (item) => {
  const newPath = [...postPath, { kind: level, name: item.name }];
  setPostPath(newPath);

  const ancestorPath = newPath.slice(0, -1); // all except last
  setGetPath(ancestorPath);

  fetchItems(
    level,
    item.name,
    ancestorPath.map((p) => `${p.kind}/${p.name}`).join("/"),
    item.childKind
  );
};


const goBack = () => {
  const newPostPath = [...postPath];
  newPostPath.pop();
  setPostPath(newPostPath);

  const newGetPath = newPostPath.slice(0, -1);
  setGetPath(newGetPath);

  if (newPostPath.length === 0) {
    fetchItems();
  } else {
    const last = newPostPath[newPostPath.length - 1];
    fetchItems(
      last.kind,
      last.name,
      newGetPath.map((p) => `${p.kind}/${p.name}`).join("/"),
      last.childKind
    );
  }
};




return (
  <div className="p-6 max-w-2xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Hierarchy Manager</h1>

    {getPath.length > 0 && (
      <button
        onClick={goBack}
        className="mb-4 px-3 py-1 bg-gray-200 rounded cursor-pointer"
      >
        ⬅ Back
      </button>
    )}

    <h2 className="text-xl mb-2">Level: {level}</h2>

    <ul className="border rounded p-3 mb-4">
      {items.map((item, idx) => (
        <li
          key={idx}
          className="flex justify-between p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => item.childKind && handleClick(item)}
        >
          <span>{item.name}</span>
          {item.childKind && (
            <span className="text-sm text-gray-500">
              ➡ {item.childKind}
            </span>
          )}
        </li>
      ))}
      {items.length === 0 && <li className="text-gray-500">No items found</li>}
    </ul>

    <div className="flex gap-2">
      <input
        type="text"
        placeholder={`New ${level} name`}
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="border p-2 flex-1 rounded"
      />
      <input
        type="text"
        placeholder="Child kind (optional)"
        value={childKind}
        onChange={(e) => setChildKind(e.target.value)}
        className="border p-2 flex-1 rounded"
      />
      <button
        onClick={addItem}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add
      </button>
    </div>
  </div>
);
}
