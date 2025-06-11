// pages/about.js

import Head from 'next/head';
import styles from '../styles/about.module.css';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us</title>
        <meta name="description" content="About our company" />
      </Head>
      <main className={styles.aboutContainer}>
        <h1>About Us</h1>
        <p>This is the About page.</p>
      </main>
    </>
  );
}