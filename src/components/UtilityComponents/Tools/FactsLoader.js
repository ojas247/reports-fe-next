'use client';

import { useState, useEffect } from 'react';

export default function FactsLoader({ isLoading = true }) {
  const facts = [
    "Octopuses have three hearts: two pump blood through the gills, while the third pumps it through the rest of the body.",
    "A flock of crows is known as a murder.",
    "Honey never spoils. Archaeologists have discovered pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
    "The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.",
    "A group of flamingos is called a flamboyance.",
    "Wombat poop is cube-shaped, which helps it stack and mark territory without rolling away.",
    "The unicorn is the national animal of Scotland.",
    "Bananas are berries, but strawberries aren't.",
    "A single strand of spaghetti is called a spaghetto.",
    "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion of the iron."
  ];

  const [currentFact, setCurrentFact] = useState('');

  useEffect(() => {
    if (!isLoading) return;

    const randomIndex = Math.floor(Math.random() * facts.length);
    setCurrentFact(facts[randomIndex]);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6">
      {/* Same spinner style as CrawlerBoard */}
      <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      
      <p className="text-xs font-mono mt-3 text-slate-500 tracking-wider">
        LOADING...
      </p>

      {/* Random fact */}
      <p className="text-xs text-slate-500 mt-4 max-w-md text-center leading-relaxed italic px-4">
        {currentFact}
      </p>
    </div>
  );
}