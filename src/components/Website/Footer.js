// import Link from 'next/link';

// function Footer() {
//     return (
//         <div
//           id="footer-container"
//           className="flex w-full flex-wrap items-start bg-[rgb(244,245,255)] p-2 sm:flex-row sm:items-center sm:justify-start"
//         >
//           <div className="m-1 pl-1 text-center text-black sm:text-left">
//             <small>MarketReports by Synthesis | Copyright ©2024</small>
//           </div>

//           <div className="m-1 pl-1 text-center sm:text-left">
//             <small>
//               <Link className="no-underline text-black" href="/Policies/TandC">Terms & Conditions</Link>
//             </small>
//           </div>

//           <div className="m-1 pl-1 text-center sm:text-left">
//             <small>
//               <Link className="no-underline text-black" href="/Policies/RefundPolicy">Refund Policy</Link>
//             </small>
//           </div>

//           <div className="m-1 pl-1 text-left">
//             <small>
//               <Link className="no-underline text-black" href="/Policies/ContactUs">ContactUs</Link>
//             </small>
//           </div>

//           <div className="m-1 pl-1 text-left">
//             <small>
//               <Link className="no-underline text-black" href="/Policies/Privacy">Privacy</Link>
//             </small>
//           </div>
//         </div>
//       );
// }

// export default Footer;





'use client';

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#111] text-gray-200 py-10 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* LOGO + DESCRIPTION */}
        <div>
          <Link href="/">
            <Image className="bg-white" src="/Assets/Images/Logo/bnw.svg" alt="MarketInsight" width={180} height={280} />
          </Link>
          <p className="text-sm text-gray-400 mb-4">A Synthesis Data Product</p>
          <p className="text-sm text-gray-500">
            A Public Data Platform, where core-data is free for everyone to access and download. We simplify complex data into simple and interactive visuals.
          </p>
        </div>

        {/* COMPANY LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">COMPANY</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/Community/About" className="hover:text-white transition">About Us</Link></li>
            <li><Link href="/Community/Volunteers" className="hover:text-white transition">For Contribution</Link></li>
            <li><Link href="/Community/ContactUs" className="hover:text-white transition">Contact Us</Link></li>
            <li><Link href="/Community/faq" className="hover:text-white transition">FAQs</Link></li>
          </ul>
        </div>

        {/* FOLLOW US */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">FOLLOW US</h3>
          <div className="flex space-x-4 text-lg">
            <a href="https://x.com/data_bytes_247" className=" text-gray-400 hover:text-blue-700"><i className="bi bi-twitter-x"></i></a>
            <a href="https://www.linkedin.com/company/market-reports-and-data/" className=" text-gray-400 hover:text-blue-700"><i className="bi bi-linkedin"></i></a>
            <a href="https://in.pinterest.com/MarketReportsIn/" className=" text-gray-400 hover:text-blue-700"> <i className="bi bi-pinterest"></i></a>
            {/* <a href="#" className=" text-gray-400  hover:text-blue-700"><i className="bi bi-facebook"></i></a>
            <a href="#" className=" text-gray-400 hover:text-blue-700"><i className="bi bi-instagram"></i></a>
            */}
          </div>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">HOW WE MAY HELP YOU?</h3>
          <p className="flex items-center text-sm text-gray-400">
            <i className="bi bi-telephone-fill text-gray-400 mr-2"></i> (+91) 911 2434 968
          </p>
          <p className="flex items-center text-sm text-gray-400">
            <i className="bi bi-envelope-fill text-gray-400 mr-2"></i> admin@marketreports.in
          </p>
        </div>

        {/* REGISTERED OFFICE + POLICIES */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">REGISTERED OFFICE</h3>
          <p className="text-sm text-gray-400">
            MarketReports India Pvt Ltd. <br />
            7th Floor, Cnergy, Appasaheb Marathe Marg, Prabhadevi, Mumbai - 400025
          </p>
          <p className="text-sm mt-2 text-gray-400">
            CIN: <span className="text-green-400">U74140MH1984PLC033397</span>
          </p>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">POLICIES</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/Policies/Privacy" className="hover:text-green-400">Privacy Policy</Link></li>
            <li><Link href="/Policies/TandC" className="hover:text-green-400">Terms of Use</Link></li>
            <li><Link href="/Policies/RefundPolicy" className="hover:text-green-400">Refund Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} MarketReports by Synthesis | All Rights Reserved
      </div>
    </footer>
  );
}
