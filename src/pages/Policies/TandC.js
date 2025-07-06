import React from 'react';
import NavBar from '../../components/Functionalities/NavBar';
import Footer from '../../components/Website/Footer';

function TandC() {

    return (
        <>
            <NavBar />
            <div className='text-justify items-center pl-0 pr-4 sm:pr-6'>
                <div className="mt-5 ml-[4%] font-bold text-2xl">
                    <h1>Terms and Conditions</h1>
                </div>
                <div className="pl-[50px] ">
                    <p>The below terms and conditions outline the rules and regulations for the use of MarketReports&apos;s Website (which is completely owned and controlled by Synthesis), which can be accessed via internet at the following url - https://marketreports.in</p>
                </div>

                <div className="pl-[50px] list-disc py-2.5">
                    <div className='py-2.5'>
                        <h4 className='font-bold'>1. Intellectual Property Rights</h4>
                        <p>Other than the content you own, under the Terms & Conditions detailed herein, MarketReports and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
                    </div>
                    <div className='py-2.5'>
                        <h4 className='font-bold'>2. Restrictions</h4>
                        <p>You are specifically restricted from all of the following:</p>
                        <ul className=' list-disc pl-6'>
                            <li>Publishing any propritary material contained in this website, on any other media</li>
                            <li>Selling, sublicensing and/or otherwise commercializing any Website material</li>
                            <li>Publicly performing and/or showing any Website material</li>
                            <li>Using this Website in any way that is or may be damaging to this Website</li>
                            <li>Using this Website in any way that impacts user access to this Website</li>
                            <li>Using this Website contrary to applicable laws and regulations</li>
                        </ul>
                    </div>

                    <div className='py-2.5'>
                        <h4 className='font-bold'>3. No warranties</h4>
                        <p>This Website is provided &quot;as is,&quot; with all faults, and MarketReports express no representations or warranties, of any kind related to this Website or the materials contained on this Website.</p>
                    </div>
                    <div className='py-2.5'>
                        <h4 className='font-bold'>4. Limitation of liability</h4>
                        <p>In no event shall MarketReports, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website.  MarketReports, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>
                    </div>
                    <div className='py-2.5'>
                        <h4 className='font-bold'>5. Indemnification</h4>
                        You hereby indemnify to the fullest extent, &apos;MarketReports&apos; and &apos;Synthesis&apos; from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.
                    </div>
                    <div className='py-2.5'>
                        <h4 className='font-bold'>6. Severability</h4>
                        <p>If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.</p>
                    </div>
                    <div className='py-2.5'>
                        <h4 className='font-bold'>7. Variation of Terms</h4>
                        <p>MarketReports is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.</p>
                    </div>
                    <div className='py-2.5'>
                        <h4 className='font-bold'>8. Assignment</h4>
                        <p>MarketReports is allowed to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.</p>
                    </div>
                    <div className='py-2.5'>
                        <h4 className='font-bold'>9. Entire Agreement</h4>
                        <p>These Terms constitute the entire agreement between MarketReports and you in relation to your use of this Website, and supersede all prior agreements and understandings.</p>
                    </div>
                    <div className='py-2.5'>
                        <h4 className='font-bold'>10. Governing Law & Jurisdiction</h4>
                        <p>These Terms will be governed by and interpreted in accordance with the laws of the State of Country, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Country for the resolution of any disputes.</p>
                    </div>

                    <div className='py-2.5'>
                        <h4 className='font-bold'>11. Terms of Using the Website and its Services</h4>
                        <p> The user is free to navigate the website and consume all of its research reports published on the same, as long as the user does not tamper with the Brand of MarketReports and misuses it in any unlawful and/or unethical manner. Failing to do so will call for action from the MarketReports team in accordance with laws of India.</p>
                    </div>

                </div>
            </div>

            <Footer />

        </>
    )


}

export default TandC;