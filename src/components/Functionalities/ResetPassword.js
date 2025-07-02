'use client';

import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../styles/Pages/Settings/resetPass.module.css';
import Link from 'next/link';
import Image from 'next/image';

const ResetPassword = () => {
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await axios.post(`${backendAPI}/reset-password`, {
                email: email
            });

            if (response.data.status === "success") {
                setMessage('Password reset link has been sent to your email. Plesae also check your Spam Folder.');

            } else {
                setError(response.data.status === "failed");
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
            console.error('Reset password error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={styles.vh100}>
            <div className={styles.hCustom}>

                <div className={styles.resetWrapper}>
                    <div className={styles.imageSection}>
                        <Image
                            src="https://storage.googleapis.com/marketreports/Brand/ResetPassword.jpg"
                            className={styles.imgFluid}
                            alt="Reset Password"
                        />
                    </div>

                    <div className={styles.formSection}>
                        {loading && (
                            <div className={styles.loaderContainer}>
                                <div className={styles.spinner} role="status"></div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <p>
                                <b>Reset Password</b>
                            </p>

                            {message && <div className={styles.success}>{message}</div>}
                            {error && <div className={styles.error}>{error}</div>}

                            <div className={styles.inputGroup}>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                />
                            </div>

                            <div className={styles.buttonGroup}>
                                <button type="submit" className={styles.button}>
                                    Send Reset Link
                                </button>
                                <p className={styles.loginText}>
                                    Remember your password?{" "}
                                    <Link href="/Login" className={styles.loginLink}>
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
};

export default ResetPassword; 