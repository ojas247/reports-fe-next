'use client'
import React, { useEffect, useState } from "react";
import SingleDropDown_v1 from "@/components/UtilityComponents/SingleDropdown_v1";
import NavBar_PostLogin from "@/components/Website/NavBar_PostLogin"
import SearchBar from '../components/Functionalities/SearchBar';
import CollapsibleSidebar from '@/components/Website/CollapsibleSidebar';
import MarketUpdate from '@/components/Website/MarketUpdate';
import AutoCarouselBanner from '@/components/Website/AutoCarouselBanner'


export default function MarketSectors() {
  const bannerImages = [
    '/Assets/Images/DigitalRev.png', // Replace with your image paths (local or external URLs)
    '/Assets/Images/DigitalRev.png', // Replace with your image paths (local or external URLs)
    '/Assets/Images/DigitalRev.png', // Replace with your image paths (local or external URLs)
  ];
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <MarketUpdate />
    </div>
  );
}
