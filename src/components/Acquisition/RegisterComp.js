'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { pushGTMEvent, CreateUserId } from '../../pages/api/UtilFunctions';

const RegisterComp = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create user record
      await CreateUserId(email, password, phone);

      // Push GTM analytics event
      pushGTMEvent({
        eventName: 'register_success',
        eventParams: {
          button_name: 'register_button',
          page: typeof window !== 'undefined' ? window.location.pathname : '',
        },
        userId: email,
        userProperties: {
          role: 'lead',
          plan: 'xxx',
          country: 'IN',
        },
      });

      // Redirect to login with success message
      router.push({
        pathname: '/Login',
        query: { message: 'Account created successfully. Please sign in.' },
      });
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Registration failed. Please try again or use a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        {/* Left Column – Branding */}
        <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
          <div className="hidden sm:block">
            <span className="inline-block font-mono text-[11px] sm:text-xs tracking-wider uppercase text-[#C7912F] font-semibold bg-[#F4E6C9]/40 px-3 py-1 rounded-full border border-[#C7912F]/20">
              Free Access · No Credit Card
            </span>
            
            <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#152238] leading-[1.2]">
              Start exploring <span className="text-[#C7912F]">leading indicators</span> today
            </h1>
            
            <p className="mt-3 text-sm sm:text-base text-[#4A5568] leading-relaxed max-w-md">
              Create a free account to download research reports, track live macro signals, and build watchlists across 70+ sectors.
            </p>
          </div>

          {/* Benefits Card – matches homepage style */}
          <div className="relative w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-[#152238] rounded-2xl p-5 sm:p-6 text-white shadow-2xl border border-white/10 space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-xs sm:text-sm font-semibold tracking-wide">What you get instantly</h3>
                <span className="font-mono text-[10px] text-[#6FD3A5] uppercase tracking-wider bg-[#6FD3A5]/10 px-2.5 py-0.5 rounded-full border border-[#6FD3A5]/20">
                  Free Forever
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { title: "1,000+ Reports", desc: "Free download of research datasets" },
                  { title: "80,000+ Datapoints", desc: "High-frequency economic indicators" },
                  { title: "70+ Sectors", desc: "Coverage across industries & sub-sectors" },
                  { title: "Live Macro Tracker", desc: "Real-time signal dashboard access" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-[#C7912F]/20 border border-[#C7912F]/40 flex items-center justify-center shrink-0">
                      <span className="text-[#C7912F] text-xs font-bold">✓</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <div className="text-xs text-[#B7C1D6]">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column – Registration Form */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="w-full max-w-md mx-auto lg:ml-auto">
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-[#DDE3DE] rounded-2xl shadow-sm p-6 sm:p-8 space-y-5"
              noValidate
            >
              {/* Header */}
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#152238] tracking-tight">
                  Create your free account
                </h2>
                <p className="text-sm text-[#4A5568]">
                  Join analysts and strategists using MarketReports
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 bg-[#F0A08C]/15 border border-[#F0A08C]/30 text-[#C0392B] text-sm p-3.5 rounded-xl"
                >
                  <span className="mt-0.5">!</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Phone Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="block text-xs font-mono font-medium uppercase tracking-wider text-[#4A5568]"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  placeholder="9876543210"
                  className="w-full px-4 py-2.5 bg-[#F2F5F2] border border-[#DDE3DE] rounded-xl text-sm text-[#152238] placeholder:text-[#4A5568]/60 focus:outline-none focus:ring-2 focus:ring-[#C7912F] focus:border-transparent focus:bg-white transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-mono font-medium uppercase tracking-wider text-[#4A5568]"
                >
                  Work Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 bg-[#F2F5F2] border border-[#DDE3DE] rounded-xl text-sm text-[#152238] placeholder:text-[#4A5568]/60 focus:outline-none focus:ring-2 focus:ring-[#C7912F] focus:border-transparent focus:bg-white transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
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
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-[#F2F5F2] border border-[#DDE3DE] rounded-xl text-sm text-[#152238] placeholder:text-[#4A5568]/60 focus:outline-none focus:ring-2 focus:ring-[#C7912F] focus:border-transparent focus:bg-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#4A5568] select-none">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="rounded border-[#DDE3DE] text-[#C7912F] focus:ring-[#C7912F] h-4 w-4"
                    disabled={loading}
                  />
                  <span className="text-xs sm:text-sm">Remember me</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 bg-[#152238] hover:bg-[#223353] text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Free Account →</span>
                )}
              </button>

              {/* Login Link */}
              <p className="text-sm text-center text-[#4A5568] pt-2">
                Already have an account?{' '}
                <Link
                  href="/Login"
                  className="font-semibold text-[#C7912F] hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterComp;