import React, { useEffect } from 'react'
import { useRouter } from 'next/router';
import NavBar from "../components/Functionalities/NavBar";
import Footer from "../components/Website/Footer";
import Link from 'next/link';
import { pushGTMEvent } from '../pages/api/UtilFunctions';
import Image from 'next/image';
function PaymentSuccess() {

  const router = useRouter();
  const myorder = router.query.myorder;
  console.log("Order ID:", myorder);
  let myorder_short = null;
  if (myorder) {
    myorder_short = myorder.substring(8,18);
  }

  useEffect(() => {
    if (window.dataLayer && myorder) {
      // Push GTM event
      pushGTMEvent({
        eventName: 'paymentSuccess',
        eventParams: {
          orderId: myorder,
          page: window.location.pathname
        },
        userId: sessionStorage.getItem('clientCode'),
        userProperties: {
          role: 'client',
          plan: 'xxx',
          country: 'IN'
        }
      });
    }
  }, [myorder]);

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center text-center pt-20 px-4 min-h-screen">
        <div className="w-full max-w-md bg-gray-200 rounded-2xl shadow-lg p-6">
          <Image
            src="https://img.icons8.com/color/96/000000/ok--v1.png"
            alt="Success Icon"
            className="mx-auto mb-4"
            fill
          />
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="mb-2">Thank you for your purchase.</p>
          <p className="mb-4">
            Your order number is <strong>{myorder_short}</strong>.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Return to <span className="font-bold text-blue-600">Homepage</span>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  )
}
export default PaymentSuccess
