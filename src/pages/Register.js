import { useRouter } from 'next/router';
import NavBar from "../components/Navbar/NavBar";
import RegisterComp from "../components/Acquisition/RegisterComp";
import Footer from "../components/Website/Footer";
export default function Register() {
  const router = useRouter();

  return (
    <main>
      <NavBar />
      <RegisterComp />  
      <Footer />
    </main>
  );
}

// from https://mdbootstrap.com/docs/standard/extended/login/