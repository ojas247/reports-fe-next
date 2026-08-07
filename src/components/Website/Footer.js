'use client';

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 px-6 sm:px-12 border-t border-slate-800 shrink-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand Column */}
        <div className="space-y-2">
          <Link href="/">
            <Image
            
              src="/Assets/Images/Logo/bnw.svg"
              alt="MarketInsight"
              width={160}
              height={40}
            />
          </Link>
          <p className="text-xs font-mono text-emerald-400 font-semibold tracking-wide">
            A Synthesis Data Product
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            A Public Data Platform, where core-data is free for everyone to access and download. We simplify complex data into simple and interactive visuals.
          </p>
        </div>

        {/* Company Column */}
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100 mb-4">
            Company
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><Link href="/Community/About" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/Community/Volunteers" className="hover:text-white transition-colors">For Contribution</Link></li>
            <li><Link href="/Community/ContactUs" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/Community/faq" className="hover:text-white transition-colors">FAQs</Link></li>
          </ul>
        </div>

        {/* Connect Column */}
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100 mb-4">
            Follow Us
          </h3>
          <div className="flex items-center gap-3 text-base text-slate-400 mb-6">
            <a href="https://x.com/data_bytes_247" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-all">
              <i className="bi bi-twitter-x"></i>
            </a>
            <a href="https://www.linkedin.com/company/market-reports-and-data/" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-all">
              <i className="bi bi-linkedin"></i>
            </a>
            <a href="https://in.pinterest.com/MarketReportsIn/" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-all">
              <i className="bi bi-pinterest"></i>
            </a>
          </div>

          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100 mb-2">
            Support Line
          </h3>
          <p className="flex items-center text-xs text-slate-400 mb-1">
            <i className="bi bi-telephone-fill mr-2 text-slate-500"></i> (+91) 911 2434 968
          </p>
          <p className="flex items-center text-xs text-slate-400">
            <i className="bi bi-envelope-fill mr-2 text-slate-500"></i> admin@marketreports.in
          </p>
        </div>

        {/* Office & Legal Column */}
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100 mb-3">
            Registered Office
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            MarketReports India Pvt Ltd. <br />
            7th Floor, Cnergy, Appasaheb Marathe Marg, Prabhadevi, Mumbai - 400025
          </p>
          <p className="text-xs mt-2 text-slate-400">
            CIN: <span className="text-emerald-400 font-mono">U74140MH1984PLC033397</span>
          </p>

          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100 mt-6 mb-2">
            Policies
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li><Link href="/Policies/Privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/Policies/TandC" className="hover:text-emerald-400 transition-colors">Terms of Use</Link></li>
            <li><Link href="/Policies/RefundPolicy" className="hover:text-emerald-400 transition-colors">Refund Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="mt-10 border-t border-slate-800/80 pt-6 text-center text-slate-500 text-xs font-mono">
        © {new Date().getFullYear()} MarketReports by Synthesis | All Rights Reserved
      </div>
    </footer>
  );
}