'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { pushGTMEvent, setSessionToken } from '../../pages/api/UtilFunctions';
import Link from 'next/link';
import Image from 'next/image';

const LoginComp = ({ message }) => {
  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authenticationFailed, setAuthenticationFailed] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthenticationFailed(false);

    try {
      const response = await axios.post(`${backendAPI}/UserLogin`, {
        username,
        password,
      });

      if (response.data === "Incorrect Credentials or Try Registering") {
        setAuthenticationFailed(true);
        return;
      }

      setSessionToken(response.data.jwt);
      localStorage.setItem('UCC', response.data.clientCode);

      pushGTMEvent({
        eventName: 'login_success',
        eventParams: {
          button_name: 'login_button',
          page: typeof window !== 'undefined' ? window.location.pathname : '',
        },
        userId: response.data.clientCode,
        userProperties: {
          role: 'client',
          plan: 'xxx',
          country: 'IN',
        },
      });

      router.push('/Research/Data');
    } catch (error) {
      console.error("Login Error:", error);
      setAuthenticationFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        {/* Left Column – Branding / Illustration */}
        <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
          <div className="hidden sm:block">
            <span className="inline-block font-mono text-[11px] sm:text-xs tracking-wider uppercase text-[#C7912F] font-semibold bg-[#F4E6C9]/40 px-3 py-1 rounded-full border border-[#C7912F]/20">
              Secure Client Access
            </span>
            
            <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#152238] leading-[1.2]">
              Welcome back to your <span className="text-[#C7912F]">data dashboard</span>
            </h1>
            
            <p className="mt-3 text-sm sm:text-base text-[#4A5568] leading-relaxed max-w-md">
              Sign in to access live macro indicators, free research reports, and high-frequency datasets across 70+ sectors.
            </p>
          </div>

          {/* Illustration – matches homepage style */}
          <div className="relative w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-[#152238] rounded-2xl p-5 sm:p-6 text-white shadow-2xl border border-white/10">
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                <h3 className="text-xs sm:text-sm font-semibold tracking-wide">Macro Signal Tracker</h3>
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#6FD3A5] uppercase tracking-wider bg-[#6FD3A5]/10 px-2 py-0.5 rounded-full border border-[#6FD3A5]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6FD3A5] animate-pulse"></span> Live
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { name: "RAIL FREIGHT", val: "142.6 MT", chg: "▲ 2.1%", up: true },
                  { name: "POWER DEMAND", val: "235 GW", chg: "▲ 4.4%", up: true },
                  { name: "CEMENT DISPATCH", val: "38.2 MT", chg: "▼ 1.2%", up: false },
                  { name: "DIESEL CONSUMPTION", val: "7.9 MT", chg: "▲ 0.8%", up: true },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] font-medium text-[#B7C1D6] block truncate">{item.name}</span>
                    <div className="font-mono text-sm sm:text-base font-bold">{item.val}</div>
                    <div className={`text-[11px] font-mono font-semibold ${item.up ? 'text-[#6FD3A5]' : 'text-[#F0A08C]'}`}>
                      {item.chg}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column – Login Form */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="w-full max-w-md mx-auto lg:ml-auto">
            <form
              onSubmit={handleLogin}
              className="bg-white border border-[#DDE3DE] rounded-2xl shadow-sm p-6 sm:p-8 space-y-5"
              noValidate
            >
              {/* Header */}
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#152238] tracking-tight">
                  Sign in to MarketReports
                </h2>
                <p className="text-sm text-[#4A5568]">
                  Access your reports and live market insights
                </p>
              </div>

              {/* Success Banner */}
              {message && (
                <div
                  role="status"
                  className="flex items-start gap-2.5 bg-[#1E7A5C]/10 border border-[#1E7A5C]/20 text-[#1E7A5C] text-sm p-3.5 rounded-xl"
                >
                  <span className="mt-0.5">✓</span>
                  <span>{message}</span>
                </div>
              )}

              {/* Error Banner */}
              {authenticationFailed && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 bg-[#F0A08C]/15 border border-[#F0A08C]/30 text-[#C0392B] text-sm p-3.5 rounded-xl"
                >
                  <span className="mt-0.5">!</span>
                  <span>Incorrect credentials. Please try again or create an account.</span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-mono font-medium uppercase tracking-wider text-[#4A5568]"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 bg-[#F2F5F2] border border-[#DDE3DE] rounded-xl text-sm text-[#152238] placeholder:text-[#4A5568]/60 focus:outline-none focus:ring-2 focus:ring-[#C7912F] focus:border-transparent focus:bg-white transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-mono font-medium uppercase tracking-wider text-[#4A5568]"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-[#F2F5F2] border border-[#DDE3DE] rounded-xl text-sm text-[#152238] placeholder:text-[#4A5568]/60 focus:outline-none focus:ring-2 focus:ring-[#C7912F] focus:border-transparent focus:bg-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#4A5568] select-none">
                  <input
                    type="checkbox"
                    className="rounded border-[#DDE3DE] text-[#C7912F] focus:ring-[#C7912F] h-4 w-4"
                    disabled={loading}
                  />
                  <span className="text-xs sm:text-sm">Remember me</span>
                </label>

                <Link
                  href="/Settings/ResetPassword"
                  className="text-xs sm:text-sm font-medium text-[#C7912F] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 bg-[#152238] hover:bg-[#223353] text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In →</span>
                )}
              </button>

              {/* Register CTA */}
              <p className="text-sm text-center text-[#4A5568] pt-2">
                Don&apos;t have an account?{' '}
                <Link
                  href="/Register"
                  className="font-semibold text-[#C7912F] hover:underline"
                >
                  Create free account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComp;