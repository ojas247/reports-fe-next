'use client'
import React, { useEffect, useState } from "react";
import SingleDropDown_v1 from "@/components/UtilityComponents/SingleDropdown_v1";
import NavBar_PostLogin from "@/components/Website/NavBar_PostLogin"
import SearchBar from '../components/Functionalities/SearchBar';
import CollapsibleSidebar from '@/components/Website/CollapsibleSidebar';
import MarketUpdate from '@/components/Website/MarketUpdate';
import CrossFilters from '@/components/UtilityComponents/Tools/CrossFilters';
import AutoCarouselBanner from '@/components/Website/AutoCarouselBanner'


export default function MarketSectors() {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <CrossFilters />
    </div>
  );
}
