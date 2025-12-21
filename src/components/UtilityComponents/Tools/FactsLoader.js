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

    // Pick a random fact on load
    const randomIndex = Math.floor(Math.random() * facts.length);
    setCurrentFact(facts[randomIndex]);

    // Optional: Cleanup (no interval needed)
    return () => {};
  }, [isLoading, facts.length]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="animate-pulse mb-6 flex justify-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
        </div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Loading...</h2>
        <p className="text-gray-600 italic transition-opacity duration-500 ease-in-out opacity-100 text-sm leading-relaxed max-w-prose mx-auto">
          {currentFact}
        </p>
      </div>
    </div>
  );
}