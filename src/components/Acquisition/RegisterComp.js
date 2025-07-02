import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { pushGTMEvent, encryptPassword, CreateUserId } from '../../pages/api/UtilFunctions';
import styles from "../../styles/Pages/login.module.css"
import Link from 'next/link';
import Image from 'next/image';

const RegisterComp = () => {
  const [email, setEmail] = useState("example@mail.com");
  const [password, setPassword] = useState("pass");
  const router = useRouter();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    // Encrypt the password before sending//
    // const encryptedPassword = encryptPassword(password);
    CreateUserId(email, password);
    navigate('/Login', { state: { "message": "User Registered Successfully. Please Login to Continue." } });

       // Push GTM event
       pushGTMEvent({
        eventName: 'register_success',
        eventParams: {
          button_name: 'register_button',
          page: window.location.pathname
        },
        userId: email,
        userProperties: {
          role: 'lead',
          plan: 'xxx',
          country: 'IN'
        }
      });
  };



  return (
    <section className="h-screen">
      <div className="w-full h-full">
        <div className="flex justify-center items-center h-full flex-wrap">
          <div className="w-full md:w-6/12 lg:w-5/12 xl:w-5/12 px-4">
            <Image
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw1.webp"
              className="w-full h-auto"
              alt=""
            />
          </div>
          <div className="w-full md:w-6/12 lg:w-5/12 xl:w-4/12 px-4">
          <p className={styles.LoginDEscTitle}>Register to Search Reports</p>
            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="form3Example3" className="block">
                  <input
                    type="email"
                    id="form3Example3"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email address"
                    style={{ opacity: 0.4 }}
                  />
                </label>
              </div>
  
              {/* Password Field */}
              <div className="mb-3">
                <label htmlFor="form3Example4" className="block">
                  <input
                    type="password"
                    id="form3Example4"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="New password"
                    style={{ opacity: 0.4 }}
                  />
                </label>
              </div>
  
              {/* Checkbox */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="form2Example3"
                    className="mr-2"
                  />
                  <label htmlFor="form2Example3" className="text-sm">
                    Remember me
                  </label>
                </div>
              </div>
  
              {/* Submit Button */}
              <div className="text-center mt-6 pt-2">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className={styles.loginBtn}
                   >
                  Register
                </button>
                <p className="text-sm font-semibold mt-2 pt-1 mb-0">
                  Already have an account?{" "}
                  <Link href="/login" className="text-red-600 hover:underline">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
  
}

export default RegisterComp;