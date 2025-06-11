'use client';

import { useEffect } from 'react';

function Carousel1(props) {
    const img_url_map = props.img_url_map
    useEffect(() => {
      const prev = document.getElementById('prev-btn');
      const next = document.getElementById('next-btn');
      const list = document.getElementById('item-list');
  
      const itemWidth = 150;
      const padding = 10;
  
      const handlePrevClick = () => {
        list.scrollLeft -= itemWidth + padding;
      };
  
      const handleNextClick = () => {
        list.scrollLeft += itemWidth + padding;
      };
  
      if (prev && next && list) {
        prev.addEventListener('click', handlePrevClick);
        next.addEventListener('click', handleNextClick);
      }
  
      // Cleanup function to remove event listeners
      return () => {
        if (prev && next) {
          prev.removeEventListener('click', handlePrevClick);
          next.removeEventListener('click', handleNextClick);
        }
      };
    }, []); 

    return (
        <div
          style={{
            width: "100%",
            paddingBottom: "0%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              padding: "0px 0",
              transition: "all 0.25s ease-in",
            }}
          >
            <button
              id="prev-btn"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "white",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <svg viewBox="0 0 512 512" width="20" title="chevron-circle-left">
                <path d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zM142.1 273l135.5 135.5c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L226.9 256l101.6-101.6c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L142.1 239c-9.4 9.4-9.4 24.6 0 34z" />
              </svg>
            </button>
      
            <div
              id="item-list"
              style={{
                maxWidth: "950px",
                width: "70vw",
                padding: "5px 10px",
                display: "flex",
                gap: "48px",
                scrollBehavior: "smooth",
                transition: "all 0.25s ease-in",
                overflow: "auto",
                scrollSnapType: "x mandatory",
                msOverflowStyle: "none", // IE and Edge
                scrollbarWidth: "none", // Firefox
              }}
            >
              {[
                { src: "./Assets/Images/HomePage/nascomm.jfif", link: "https://storage.googleapis.com/marketreports/Reports/Annual%20Status%20of%20Education%20Report%202022.pdf", hdfc: false },
                { src: "./Assets/Images/HomePage/Government_of_India_logo.svg", link: "https://storage.googleapis.com/marketreports/Reports/EdTech_The_Advent_of_Digital_Education.pdf", hdfc: false },
                { src: "./Assets/Images/HomePage/McKinsey.svg", link: "https://storage.googleapis.com/marketreports/Reports/Annual%20Status%20of%20Education%20Report%202022.pdf", hdfc: false },
                { src: "./Assets/Images/HomePage/HDFC.png", link: "https://storage.googleapis.com/marketreports/Reports/nasscom-India-The-Tech-Talent-Nation-Final-Dec%202023.pdf", hdfc: true },
                { src: "./Assets/Images/HomePage/RBI.PNG", link: "https://storage.googleapis.com/marketreports/Reports/nasscom-India-The-Tech-Talent-Nation-Final-Dec%202023.pdf", hdfc: true },
                { src: "./Assets/Images/HomePage/KPMG_logo.svg", link: "https://storage.googleapis.com/marketreports/Reports/edtech-2023-road-ahead-pgalabs.pdf", hdfc: false },
                { src: "./Assets/Images/HomePage/Bloomberg.png", link: "https://storage.googleapis.com/marketreports/Reports/Annual%20Status%20of%20Education%20Report%202022.pdf", hdfc: false },
                { src: "./Assets/Images/HomePage/cii.png", link: "https://storage.googleapis.com/marketreports/Reports/Annual%20Status%20of%20Education%20Report%202022.pdf", hdfc: false },
              ].map(({ src, link, hdfc }, index) => (
                <a href={link} key={index}>
                  <img
                    src={src}
                    alt={`item-${index}`}
                    style={{
                      scrollSnapAlign: "center",
                      minWidth: hdfc ? "90px" : "80px",
                      height: hdfc ? "80px" : "70px",
                      borderRadius: "8px",
                    }}
                  />
                </a>
              ))}
            </div>
      
            <button
              id="next-btn"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "white",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <svg viewBox="0 0 512 512" width="20" title="chevron-circle-right">
                <path d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm113.9 231L234.4 103.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L285.1 256 183.5 357.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L369.9 273c9.4-9.4 9.4-24.6 0-34z" />
              </svg>
            </button>
          </div>
        </div>
      );
        
};

export default Carousel1;
