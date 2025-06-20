import React, { useEffect } from 'react'
import { useRouter } from 'next/router';
import NavBar from "../components/Functionalities/NavBar";
import Footer from "../components/Website/Footer";

import { pushGTMEvent } from '../pages/api/UtilFunctions';

function PaymentSuccessPage() {
    const router = useRouter();
    const queryParams = new URLSearchParams(router.query);
    const myorder = queryParams.get('myorder');
   const myorder_short = myorder.substring(8,15);

   
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
        <div className="flex items-center justify-center text-center pt-20 px-4 min-h-screen">
        <div className="w-full max-w-md bg-gray-200 rounded-2xl shadow-lg p-6">
          <img
            src="https://img.icons8.com/color/96/000000/ok--v1.png"
            alt="Success Icon"
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="mb-2">Thank you for your purchase.</p>
          <p className="mb-4">
            Your order number is <strong>{myorder_short}</strong>.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    )
}
export default PaymentSuccessPage
