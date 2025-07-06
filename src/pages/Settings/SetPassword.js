
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import NavBar from "../../components/Functionalities/NavBar";
import Footer from "../../components/Website/Footer";
import styles from '../../styles/Pages/Settings/setPassword.module.css';
import Link from 'next/link'; 
import Image from 'next/image';

export default function SetPassword() {
  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const response = await axios.post(`${backendAPI}/set-password`, {
        email: email,
        password: password,
      });

      if (response.data.status === "success") {
        setSuccessMsg('Password set successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/Login');
        }, 3000);
      }
    } catch (err) {
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <NavBar />

      <section className={styles.fullHeight}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.imageCol}>
              <Image
                src="https://storage.googleapis.com/marketreports/Brand/ResetPassword.jpg"
                className={styles.image}
                alt="Reset Password"
                fill
              />
            </div>

            <div className={styles.formCol}>
              {loading && (
                <div className={styles.loaderContainer}>
                  <div className={styles.spinner}></div>
                </div>
              )}

              {successMsg && (
                <div className={styles.alertSuccess}>
                  {successMsg} <Link href="/Login" className={styles.linkPrimary}>Login</Link>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <p><b>Set Password</b></p>

                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.submitButton}>
                    Set Password
                  </button>
                  <p className={styles.loginText}>
                    Remember your password?{" "}
                    <Link href="/Login" className={styles.linkDanger}>Login</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

    </section>
  );

}