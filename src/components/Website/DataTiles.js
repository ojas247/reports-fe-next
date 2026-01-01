'use client';

import Image from "next/image";

export default function DataTiles() {
  const frontendAPI = process.env.NEXT_PUBLIC_frontendAPI;

  const images = [
    {
      src: "https://storage.googleapis.com/marketreports/Blogs/HomeMosaic/SS8.png",
      sector: "Insurance",
      title: "Penetration of LIC Life peaked to 3.2%, curtesy IPO",
      icon: "bi-shield-check",
      url: `${frontendAPI}/DataSets/FinTech/Life-Insurance-Penetration-and-MarketShare-of-LIC`,
    },
    {
      src: "https://storage.googleapis.com/marketreports/Blogs/HomeMosaic/SS7.png",
      sector: "Aviation",
      title: "Indian Aviation has a fleet size of 820 - 10% jump since FY23",
      icon: "bi-airplane-engines",
      url: `${frontendAPI}/DataSets/Infra%20&%20Utilities/Growth-of-Civil-Aviation-Fleet-Strength-of-Aircrafts`,
    },
    {
      src: "https://storage.googleapis.com/marketreports/Blogs/HomeMosaic/SS12.png",
      sector: "Telecom",
      title: "Jio has 40% market share with 480Mn subscribers",
      icon: "bi-phone",
      url: `${frontendAPI}/DataSets/Infra%20&%20Utilities/Telecom-Service-Providers-Subscriber-Base-in-Rural-India`,
    },
    {
      src: "https://storage.googleapis.com/marketreports/Blogs/HomeMosaic/SS9.png",
      sector: "Automobile",
      title: "India sells 50k 2-wheelers in domestics markets",
      icon: "bi-car-front",
      url: `${frontendAPI}/DataSets/Automobiles/Automobile-Domestic-Sales-2025`,
    },
    {
      src: "https://storage.googleapis.com/marketreports/Blogs/HomeMosaic/SS10.png",
      sector: "Railway",
      title: "Railway electrification is now over 90% complete ",
      icon: "bi-train-front",
      url: `${frontendAPI}/DataSets/Infra%20&%20Utilities/Railways-Operations---Electrified-Routes`,
    },
    {
      src: "https://storage.googleapis.com/marketreports/Blogs/HomeMosaic/S11.png",
      sector: "Dairy",
      title: "Indian produces 239 Mn tons of Milk, the highest in the world",
      icon: "bi-cup-straw",
      url: `${frontendAPI}/DataSets/FoodTech/Milk-Production-in-India-2024`,
    },
  ];

  return (
    <div className="p-6 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
        {images.map((img, i) => (
          <a
            key={i}
            href={img.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* <div className="relative w-full h-64"> */}
            <div className="relative w-full h-[230px] bg-gray-100 flex items-center justify-center">
              <Image
                src={img.src}
                alt={img.sector}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
              />
            </div>


            <div className="p-2 text-center flex flex-row items-center justify-center gap-4">
              <h3 className="font-bold">{img.title}</h3>

              <h3 className="inline-flex items-center gap-2 bg-[#a2bff5] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md">
                <i className={`bi ${img.icon}`}></i> {img.sector}
              </h3>
            </div>

          </a>
        ))}
      </div>
    </div>
  );
}
