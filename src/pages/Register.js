import { useRouter } from 'next/router';
import Head from 'next/head';
import NavBar from "../components/Functionalities/NavBar";
import RegisterComp from "../components/Acquisition/RegisterComp";
import Footer from "../components/Website/Footer";
export default function Register() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Create Account for accessing MarketReports</title>
      </Head>

      <main>
        <NavBar />
        <RegisterComp />
        <Footer />
      </main>
    </>
  );
}

// from https://mdbootstrap.com/docs/standard/extended/login/