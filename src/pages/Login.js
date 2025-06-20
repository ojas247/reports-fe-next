import { useRouter } from 'next/router';
import NavBar from "../components/Functionalities/NavBar";
import LoginComp from "../components/Acquisition/LoginComp";
import Footer from "../components/Website/Footer";

export default function Login() {
  const router = useRouter();
  const message = router.query.message;

  return (
    <main>
      <NavBar />
      <LoginComp message={message} />  
      <Footer />
    </main>
  );
}

// from https://mdbootstrap.com/docs/standard/extended/login/