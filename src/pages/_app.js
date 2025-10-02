import "../styles/globals.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "handsontable/dist/handsontable.full.min.css";
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* <link rel="icon" href="Assets/Images/Logo.ico/" /> */}
        <link rel="icon" href="/favicon.ico" />
        <title>MarketInsights - Search for Industry and Market Reports</title>        
      </Head>
      <Component {...pageProps} />
    </>
  );
}


