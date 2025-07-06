import React from 'react';
import NavBar from '../../components/Functionalities/NavBar';
import Footer from '../../components/Website/Footer';

function RefundPolicy() {
    return (
        <>
            <NavBar />
            <div className='text-justify pl-5 pr-5 pb-5 sm:pl-2 sm:pr-5'>
                <div className="font-bold text-2xl w-full sm:w-[80%] mt-5 px-1 sm:px-0 sm:ml-[10%] pb-5">
                    <h1>Cancellation & Refund Policy</h1>
                </div>

                <div className="text-xl pt-4  sm:text-left sm:ml-[10%]">

                    <div>
                        <p className='text-base font-semibold'>
                            SYNTHESIS (MarketReports) believes in helping its customers as far as possible, and has therefore a liberal cancellation
                            policy as briefed below. Under this policy
                        </p>
                        <p className='py-2.5 text-base'>
                            • Cancellations will be considered only if the request is within 24 hours after placing the order.
                        </p>
                        <p className='py-2.5 text-base'>
                            • SYNTHESIS does not accept cancellation requests after downloading any reports from the platform. Your cancellation request will only be entertained if you have not extensively utilized the platform.
                        </p>

                        <p className='py-2.5 text-base'>
                            • In case you feel that the product received is not as per your expectations, you must bring it to our notice within 2 Days days of subscribing to the product. Our Team after
                            looking into your complaint will take an appropriate decision for improvement of the product and further customer experience.
                        </p>

                        <p className='py-2.5 text-base'>
                            • In case of any Refunds approved by SYNTHESIS, it usually takes 3-5 Days days for the
                            refund to be processed and money being credited to the end customer&apos;s bank account.
                        </p>

                        <p className='py-2.5 text-base'>
                            • If you accidentally purchase the same report more than once, please contact our support team within 24 hours of the duplicate transaction. After verifying
                            the purchase, we will process a refund for the duplicate order.
                        </p>

                        <p className='py-2.5 text-base'>
                            • If you are unable to access the purchased report due to technical difficulties on our platform, and our support team is unable to resolve the issue within a reasonable time,
                            you may be eligible for a full or partial refund based on the circumstances.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />

        </>
    )


}

export default RefundPolicy;