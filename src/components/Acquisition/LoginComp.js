import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { pushGTMEvent, encryptPassword, setSessionToken } from '../../pages/api/UtilFunctions';
import styles from "../../styles/Pages/login.module.css"
import Link from 'next/link';
import Image from 'next/image';

const LoginComp = ({ message }) => {
  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authenticationFailed, setAuthenticationFailed] = useState(false);

  console.log("backendAPICHECK: ", process.env.NEXT_PUBLIC_backendAPI);


  const updateUsername = (e) => {
    setUsername(e.target.value)
  }

  const updatePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleLogin = () => {
    setLoading(true);
    // Encrypt the password before sending
    // const encryptedPassword = encryptPassword(password);
    const encryptedPassword = password;

    axios.post(`${backendAPI}/UserLogin`, {
      username: username,
      password: encryptedPassword
    })
      .then((response) => {
        // console.log("Token:  ", response.data.clientCode);
        router.push('/', { state: { username } });
        setSessionToken(response.data.jwt);
        localStorage.setItem('UCC', response.data.clientCode);

        if (response.data === "Incorrect Credentials or Try Registering") {
          setAuthenticationFailed(true);
          console.log("authenticationFailed: ", authenticationFailed);
        }

        // Push GTM event
        pushGTMEvent({
          eventName: 'login_success',
          eventParams: {
            button_name: 'login_button',
            page: window.location.pathname
          },
          userId: response.data.clientCode,
          userProperties: {
            role: 'client',
            plan: 'xxx',
            country: 'IN'
          }
        });


      }, (error) => {
        console.log(error);
        setAuthenticationFailed(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if (loading) {
    return (
      <div style={{ width: "80%", marginLeft: "40%" }} >
        <Image src="/Assets/Gifs/loading.gif" alt="Loading..." width={100} height={80} />
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center px-4 py-8 md:py-16">

        {/* Image Section */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <Image
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="w-full h-auto"
            alt="Illustration"
            width={500}
            height={300}
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 lg:w-2/6">
          <form className="bg-white p-6 rounded shadow-md w-full">
            {/* Success message */}
            {message && (
              <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
                {message}
              </div>
            )}

            <p className={styles.LoginDEscTitle}>Login to Search Reports</p>

            {/* Authentication failure */}
            {authenticationFailed && (
              <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                <p>Incorrect Password. Try Again</p>
              </div>
            )}

            {/* Email input */}
            <div className="mb-4">
              <input
                type="email"
                id="email"
                placeholder="Email address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-40"
                value={username}
                onChange={updateUsername}
              />
            </div>

            {/* Password input */}
            <div className="mb-4">
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-40"
                value={password}
                onChange={updatePassword}
              />
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/Settings/ResetPassword" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Login button */}
            <div className="mt-6 hover:cursor-pointer" >
              <button
                type="button"
                className={styles.loginBtn}
                onClick={handleLogin}
              >
                Login
              </button>
            </div>

            {/* Register link */}
            <p className="text-sm text-center mt-4">
              Don&apos;t have an account?{' '}
              <Link href="./Register" className="text-red-500 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>

  );
}

export default LoginComp;
