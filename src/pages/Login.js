import { useRouter } from 'next/router';
import Head from 'next/head';
import NavBar from "../components/Functionalities/NavBar";
import LoginComp from "../components/Acquisition/LoginComp";
import Footer from "../components/Website/Footer";

export default function Login() {
  const router = useRouter();
  const message = router.query.message;

  return (
    <>
      <Head>
        <title>Login to Your MarketReports Account</title>
      </Head>

      <main>
        <NavBar />
        <LoginComp message={message} />
        <Footer />
      </main>
    </>
  );
}

// from https://mdbootstrap.com/docs/standard/extended/login/