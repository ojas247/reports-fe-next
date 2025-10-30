import React, { useState } from 'react';
import NavBar from '../../components/Functionalities/NavBar';
import Footer from '../../components/Website/Footer';

function ContactUs() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here, e.g., send the data to a server.
        setSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <>
            <NavBar />
            <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto my-12 p-5 bg-white shadow-md">
                <h1 className='text-2xl font-bold mb-5 text-center'>Contact Us</h1>
                <form onSubmit={handleSubmit}>

                    <div className="mb-1">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"

                        />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"

                        />
                    </div>
                    <div className="mb-1">̣
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-y"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200">
                        Submit
                    </button>
                    {submitted && <p className="success-message">Thank you for contacting us!</p>}
                </form>

                <div className='mt-10'>
                    <h3 className='text-2xl font-bold mb-5 text-center'>Write to use at below </h3>
                    <p> <strong>Legal Entity Name:</strong> SYNTHESIS <br></br>
                        <strong>Registered Address: </strong>K 154, MIDC Area, Waluj,
                        Maharashtra, 431133<br></br>
                        <strong>Telephone No: </strong> 8958007911<br></br>
                        <strong>E-Mail ID: </strong>admin@marketreports.in
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ContactUs;
