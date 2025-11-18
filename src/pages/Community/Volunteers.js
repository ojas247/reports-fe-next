"use client";
import React from "react";
import NavBar from "../../components/Functionalities/NavBar";
import Footer from "../../components/Website/Footer";

function Volunteers() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <NavBar />

      <main className="flex-grow px-6 py-16 sm:px-10 lg:px-24">
        <section className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#27406d] mb-6">
            Join the Market Reports Mission
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            <span className="font-semibold">Market Reports</span> is a
            community-driven, open-source initiative where passionate individuals
            come together to make data accessible, understandable, and useful for
            everyone.  
            <br />
            We welcome interns, research analysts, and MBA students who are eager
            to sharpen their analytical and visualization skills while
            contributing to a shared mission — transforming raw data into
            meaningful insights.
          </p>
        </section>

        <section className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-[#27406d] mb-4">
            Be Part of Our Journey
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6">
            By joining us, you’ll collaborate with a team of volunteers who
            curate, verify, and visualize real-world data across sectors.  
            You’ll gain hands-on experience in data analysis, research, and
            reporting — helping businesses, policymakers, and individuals make
            informed decisions.
          </p>

          <button className="bg-[#27406d] text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-blue-700 transition-all duration-300">
            Apply to Join Us
          </button>

          <p className="mt-4 text-sm text-gray-600">
            Whether you are an intern, a student, or a professional — your
            contribution matters. Let us grow together.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Volunteers;
