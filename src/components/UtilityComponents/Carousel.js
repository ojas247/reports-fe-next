'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
const Carousel = ({ cards = [] }) => {
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
    }, []); // Empty dependency array ensures the effect runs only once on component mount

    return (
        <div className="w-full flex justify-center items-center bg-white">
            <div className="flex justify-between items-center gap-2.5 px-0 transition-all duration-250 ease-in">
                <button 
                    id="prev-btn" 
                    className="bg-none cursor-pointer text-white border-none transition-all duration-300 ease-in-out"
                    aria-label="Previous slide"
                >
                    <svg viewBox="0 0 512 512" width="20" title="chevron-circle-left">
                        <path d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zM142.1 273l135.5 135.5c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L226.9 256l101.6-101.6c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L142.1 239c-9.4 9.4-9.4 24.6 0 34z" />
                    </svg>
                </button>

                <div
                    id="item-list"
                    className="max-w-[950px] w-[70vw] px-2.5 py-1 flex gap-12 overflow-x-auto scroll-smooth snap-x snap-mandatory transition-all duration-250 ease-in [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    {cards.map((card, index) => (
                        <Link 
                            key={index}
                            href={card.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="snap-center"
                        >
                            <Image 
                                className="min-w-[240px] h-[120px] bg-pink-600 rounded-lg"
                                src={card.imageUrl}
                                alt={card.title}
                                fill
                            />
                        </Link>
                    ))}
                </div>

                <button 
                    id="next-btn" 
                    className="cursor-pointer bg-none border-none transition-all duration-300 ease-in-out"
                    aria-label="Next slide"
                >
                    <svg viewBox="0 0 512 512" width="20" title="chevron-circle-right">
                        <path d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm113.9 231L234.4 103.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4-9.4-9.4-24.6 0-33.9L285.1 256 183.5 357.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L369.9 273c9.4-9.4 9.4-24.6 0-34z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Carousel;
