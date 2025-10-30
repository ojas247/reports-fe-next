"use client"
import React, { useState, useEffect, useRef } from 'react';
import NavBar from "../../components/Functionalities/NavBar";
import Footer from "../../components/Website/Footer";



function FAQ() {
  const [expandedFAQs, setExpandedFAQs] = useState([true, true, true, true, true, true]);
  const toggleFAQ = (index) => {
    const newExpanded = [...expandedFAQs];
    newExpanded[index] = !newExpanded[index];
    setExpandedFAQs(newExpanded);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Market-Reports?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Market-Reports is a community-driven platform that provides a aggregation of Reports and Data for investment analysts, Fund houses and Corporate Strategists."
        }
      },
      {
        "@type": "Question",
        "name": "How can I access the reports?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can access the reports by registering on our platform and subscribing to the desired plan by paying a nominal fee."
        }
      },
      {
        "@type": "Question",
        "name": "Why do you charge when the reports and data is available in public domain?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Although we do not author or publish any reports, there is effort to aggregate reports according to various parameters. Also we as a community bear the cost of servers, databases, and cloud infrastructure. Therefore, we charge a very nominal fee just to justify these expenses."
        }
      },
      {
        "@type": "Question",
        "name": "What if I want to remove reports from this platform?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely, we understand your concern. Just drop us a line at admin@marketreports.in and we'll promptly comply with your request."
        }
      },
      {
        "@type": "Question",
        "name": "Is there customer support available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide customer support for any inquiries or assistance you may need regarding our reports."
        }
      },
      {
        "@type": "Question",
        "name": "Can I request a specific report?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! You can drop us a line at admin@marketreports.in, and we will do our best to cover the specific sector or sub-sector you are interested in."
        }
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <NavBar />

      <div className="w-full bg-gray-100 px-6 py-12 border-t border-gray-200">
        <h1 className="text-3xl sm:text-4xl text-center font-extrabold text-[#27406d] mb-6">
          Frequently Asked Questions
        </h1>

        {[
          "What is Market-Reports?",
          "How can I access the reports?",
          "Why do you charge when the reports and data is available in public domain?",
          "What if I want to remove reports from this platform?",
          "Is there customer support available?",
          "Can I request a specific report?"
        ].map((question, index) => (
          <div key={index} className="mb-6 max-w-3xl mx-auto">
            <h3
              onClick={() => toggleFAQ(index)}
              className="cursor-pointer flex justify-between items-center text-lg font-medium text-gray-800"
            >
              {question}
              <span className="text-blue-600 text-xl">{expandedFAQs[index] ? '−' : '+'}</span>
            </h3>
            {expandedFAQs[index] && (
              <p className="mt-2 text-gray-600 text-sm">{
                faqSchema.mainEntity[index].acceptedAnswer.text
              }</p>
            )}
          </div>
        ))}
      </div>


      <Footer />
    </div>
  );
}

export default FAQ;
