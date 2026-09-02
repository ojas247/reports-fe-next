import { useRouter } from 'next/router';
import Head from 'next/head';
import NavBar from "../components/Functionalities/NavBar";
import LoginComp from "../components/Acquisition/LoginComp";
import Footer from "../components/Website/Footer";

export default function Login() {
  const router = useRouter();
  const message = router.query.message;

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#0F1A2B] font-sans antialiased selection:bg-[#F4E6C9] selection:text-[#152238]">
      <Head>
        <title>Login | MarketReports — Access Your Research Dashboard</title>
        <meta
          name="description"
          content="Securely sign in to MarketReports to access free high-frequency research datasets, market indicators, and 1,000+ reports across 70+ sectors."
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Login | MarketReports" />
        <meta
          property="og:description"
          content="Sign in to access byte-size snackable data-nuggets, leading indicators, and free research reports."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://marketreports.in/login" />
        
        <link rel="canonical" href="https://marketreports.in/login" />
      </Head>

      {/* Optional thin ticker can be added later if desired */}
      
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DDE3DE]">
        <NavBar />
      </header>

      <main className="flex-1">
        <section className="pt-10 sm:pt-16 pb-16 sm:pb-24 bg-[radial-gradient(700px_300px_at_85%_-10%,#F4E6C9,transparent_70%)]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
            <LoginComp message={message} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}