import { useRouter } from 'next/router';
import Head from 'next/head';
import NavBar from "../components/Functionalities/NavBar";
import RegisterComp from "../components/Acquisition/RegisterComp";
import Footer from "../components/Website/Footer";

export default function Register() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#0F1A2B] font-sans antialiased selection:bg-[#F4E6C9] selection:text-[#152238]">
      <Head>
        <title>Create Free Account | MarketReports — Access Research & Data</title>
        <meta
          name="description"
          content="Register for free on MarketReports to access 1,000+ research reports, 80,000+ datapoints, live macro indicators, and high-frequency datasets across 70+ sectors."
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta property="og:title" content="Create Free Account | MarketReports" />
        <meta
          property="og:description"
          content="Sign up free to unlock byte-size snackable data-nuggets, leading indicators, and research reports."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://marketreports.in/register" />

        <link rel="canonical" href="https://marketreports.in/register" />
      </Head>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DDE3DE]">
        <NavBar />
      </header>

      <main>
        <section className="pt-10 sm:pt-16 pb-16 sm:pb-24 bg-[radial-gradient(700px_300px_at_85%_-10%,#F4E6C9,transparent_70%)]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
            <RegisterComp />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}