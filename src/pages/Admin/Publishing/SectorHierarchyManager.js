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
  const [loading, setLoading] = useState(false);

  // Fetch hierarchy
  const fetchItems = async (parentKind, parentName, parentPath, childKind) => {
    setLoading(true);
    try {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setItems(data.items || []);
      setLevel(data.level || (parentKind ? parentKind : "Sector"));
    } catch (err) {
      console.error("Error fetching hierarchy items:", err);
    } finally {
      setLoading(false);
    }
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

    try {
      await fetch(`${backendAPI}/HierarchyController`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setNewName("");
      setChildKind("");

      const last = postPath[postPath.length - 1];
      fetchItems(
        last ? last.kind : null,
        last ? last.name : null,
        getPath.map((p) => `${p.kind}/${p.name}`).join("/"),
        childKind
      );
    } catch (err) {
      console.error("Error adding hierarchy item:", err);
    }
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
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans antialiased p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Studio Top Banner / Header */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold shadow-2xs">
              HM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold tracking-tight text-slate-900">
                  Hierarchy Manager
                </h1>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600">
                  Taxonomy Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">Configure nested sectors, sub-categories, and data taxonomy paths</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">CURRENT DEPTH:</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 font-semibold">
              {postPath.length}
            </span>
          </div>
        </div>

        {/* Dynamic Breadcrumb Navigation Bar */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              onClick={() => {
                setPostPath([]);
                setGetPath([]);
                fetchItems();
              }}
              className={`px-2 py-1 rounded transition text-xs font-medium flex items-center gap-1 ${
                postPath.length === 0
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              <span>Root</span>
            </button>

            {postPath.map((p, idx) => (
              <React.Fragment key={idx}>
                <span className="text-slate-300">/</span>
                <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200/60 text-slate-700 font-mono text-[11px]">
                  {p.kind}: <strong className="text-slate-900 font-semibold">{p.name}</strong>
                </span>
              </React.Fragment>
            ))}
          </div>

          {postPath.length > 0 && (
            <button
              onClick={goBack}
              className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              <span>← Back</span>
            </button>
          )}
        </div>

        {/* Active Node Level Explorer */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
                Current Level:
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold">
                {level}
              </span>
            </div>
            
            <span className="text-[11px] font-mono text-slate-400">
              {items.length} {items.length === 1 ? 'ENTITY' : 'ENTITIES'}
            </span>
          </div>

          {/* Items List */}
          <div className="space-y-2">
            {loading ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-2">
                <div className="w-4 h-4 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
                <span className="text-xs font-mono text-slate-400">FETCHING LEVEL ENTITIES...</span>
              </div>
            ) : items.length > 0 ? (
              items.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => item.childKind && handleClick(item)}
                  className={`group p-3 rounded-lg border transition flex items-center justify-between ${
                    item.childKind
                      ? "bg-slate-50 hover:bg-white hover:border-slate-300 border-slate-200/70 cursor-pointer shadow-2xs"
                      : "bg-white border-slate-100 cursor-default"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-slate-200/60 text-slate-600 flex items-center justify-center font-mono text-[10px] font-bold group-hover:bg-slate-900 group-hover:text-white transition">
                      {idx + 1}
                    </div>
                    <span className="text-xs font-medium text-slate-900 group-hover:text-slate-950">
                      {item.name}
                    </span>
                  </div>

                  {item.childKind ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono bg-white group-hover:bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                        Next: {item.childKind}
                      </span>
                      <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform text-xs">
                        →
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      Terminal Node
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                <p className="text-xs text-slate-400">No hierarchy nodes found at this level.</p>
              </div>
            )}
          </div>
        </div>

        {/* Create New Entity Block */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-200/60 pb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider font-mono">
              Add New Entity to {level}
            </h3>
            <span className="text-[10px] font-mono text-slate-400">NODE CREATION CONTROL</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Entity Name *</label>
              <input
                type="text"
                placeholder={`New ${level} name...`}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
              />
            </div>

            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Child Kind (Optional)</label>
              <input
                type="text"
                placeholder="e.g. SubSector / SubTopic"
                value={childKind}
                onChange={(e) => setChildKind(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={addItem}
                className="w-full sm:w-auto px-4 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 shadow-2xs h-[32px]"
              >
                <span>+ Add Entity</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}