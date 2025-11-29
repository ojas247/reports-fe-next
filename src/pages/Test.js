'use client'
import React, { useEffect, useState } from "react";
import SingleDropDown_v1 from "@/components/UtilityComponents/SingleDropdown_v1";
import NavBar_PostLogin from "@/components/Website/NavBar_PostLogin"
import SearchBar from '../components/Functionalities/SearchBar';
import CollapsibleSidebar from '@/components/Website/CollapsibleSidebar';


export default function ExpandableSearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* MOBILE SEARCH CONTAINER */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <div className="relative flex items-center">
          {/* EXPANDABLE INPUT - Animates from icon position */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className={`
              absolute right-12 top-1/2 -translate-y-1/2
              bg-white border-2 border-gray-300 rounded-full pl-4 pr-12 py-2
              focus:border-green-600 outline-none text-[16px] placeholder-gray-400 text-gray-800
              transition-all duration-300 ease-in-out
              ${open 
                ? "w-[calc(100vw-100px)] opacity-100 shadow-lg"  // Expand to near-full width
                : "w-0 opacity-0 pointer-events-none"
              }
            `}
            onClick={(e) => e.stopPropagation()}  // Prevent click from bubbling to close
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                // Trigger search logic here
                setOpen(false);
              }
            }}
          />
          {/* SEARCH ICON BUTTON - Stays fixed, triggers expand */}
          <button
            className="p-3 rounded-full bg-white shadow flex items-center justify-center relative z-10"
            onClick={() => {
              if (open) {
                // Trigger search if open
                // Add your search logic here
                setOpen(false);
              } else {
                setOpen(true);
              }
            }}
          >
            <i className={`bi ${open ? "bi-x-lg" : "bi-search"} text-2xl text-gray-600`}></i>
          </button>
         
        </div>
      </div>
    </>
  );
}