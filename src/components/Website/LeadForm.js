import React, { useState } from 'react';
import styles from '../../styles/Pages/insightSlug.module.css';

const LeadForm = () => {
    const [email, setEmail] = useState('');
    const [PasswordPop, setPasswordPop] = useState('');


    const handleRegister = (event) => {
        event.preventDefault();
        CreateUserId(email, PasswordPop);
        navigate('/Login', { state: { "message": "User Created Successfully. Please Login to Continue." } });
        setShowPopup(false); // Close the pop-up after submission
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    };

    return (
        <div className={styles.leadFormContainer}>
                        <h3>NEED HELP IN RESEARCH?</h3>
                        <p>Signup to get access to our market reports and insights.</p>

                        <form className={styles.leadForm}>
                            <input type="text" placeholder="Your name (only if you wish)" />

                            <div className={styles.phoneInput}>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={inputStyle}
                                />
                            </div>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={PasswordPop}
                                onChange={(e) => setPasswordPop(e.target.value)}
                                required
                                style={inputStyle}
                            />

                            <button type="submit" onClick={handleRegister}>
                                Sign Up & Seach
                                <span className={styles.icon}>🔍</span>
                            </button>
                        </form>
                    </div>    );
};

export default LeadForm;
