"use client"
import React, { useState, useEffect, useRef } from 'react';
import NavBar from "../../components/Functionalities/NavBar";
import Footer from "../../components/Website/Footer";



function About() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <NavBar />

      <main className="flex-grow px-6 py-16 sm:px-10 lg:px-24">
        <section className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#27406d] mb-6">
            About <span className="text-blue-500">Market Reports</span>
          </h1>
          <p className="text-lg leading-relaxed text-gray-700 mb-8">
            <strong>Market Reports</strong> is an open-source contributor-driven platform
            where passionate contributors come together to collect, clean, and share
            valuable market data. Our mission is to make complex information
            accessible, transparent, and easy to understand.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 mb-8">
            Every dataset on our platform is curated by volunteers who believe in
            open data for all. We transform large volumes of raw data into
            <span className="font-semibold"> byte-sized, easy-to-digest insights </span>
            that help researchers, businesses, and curious minds visualize trends
            through interactive graphs, charts, and reports.
          </p>
          <p className="text-lg leading-relaxed text-gray-700">
            Our goal is simple — to empower data enthusiasts to both
            <span className="font-semibold"> contribute </span> and
            <span className="font-semibold"> consume </span> meaningful data.
            Whether you’re a student, analyst, or policy maker, Market Reports
            helps you make sense of data in a way that’s
            <span className="font-semibold text-blue-600"> clear, visual, and impactful.</span>
          </p>
        </section>

        <section className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-[#27406d] mb-4">Join Our Community</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6">
            Be part of the movement! As a flag bearer, you can help collect,
            verify, and publish datasets that drive better decisions and
            insights across industries.
          </p>
          <button className="bg-[#27406d] text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition-all duration-300">
            Become one of us
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default About;
