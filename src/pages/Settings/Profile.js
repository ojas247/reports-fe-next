
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from "../../components/Functionalities/NavBar";
import Footer from "../../components/Website/Footer";
import styles from "../../styles/Pages/Settings/profile.module.css";
import 'bootstrap-icons/font/bootstrap-icons.css';




const Profile = () => {
    const [userData, setUserData] = useState({
        username: '',
        clientCode: '',
        plan: '',
        planExpiry: null,
        planPurchase: null
    });
    const [loading, setLoading] = useState(true);
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const ucc = localStorage.getItem('UCC');
                if (!ucc) {
                    throw new Error('No ucc found');
                }

                // Fetch detailed user data from backend
                const response = await axios.get(`${backendAPI}/getProfile?clientCode=${ucc}`, {
                  
                });

                setUserData({
                    username: response.data.username,
                    clientCode: response.data.clientCode || 'N/A',
                    plan: response.data.subscriptionPlan || 'No Active Plan',
                    planExpiry: response.data.planExpiryDate ? new Date(response.data.planExpiryDate) : null,
                    planPurchase: response.data.planPurchaseDate ? new Date(response.data.planPurchaseDate) : null
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [backendAPI]);

    if (loading) {
        return <div className={styles.profileLoading}>Loading...</div>;
    }

    return (
        <>
            <NavBar />
            <div className={styles.profileContainer}>
                <div className={styles.profileCard}>
                    <div className={styles.profileAvatar}>
                    <i class="bi bi-person"></i>
                    </div>
                    <h1>Profile Details</h1>
                    <div className={styles.profileInfo}>
                        <div className={styles.infoGroup}>
                            <label>Username</label>
                            <p>{userData.username}</p>
                        </div>
                        
                        <div className={styles.infoGroup}>
                            <label>Client Code</label>
                            <p>{userData.clientCode}</p>
                        </div>

                        <div className={styles.infoGroup}>
                            <label>Current Plan</label>
                            <p>{userData.plan}</p>
                        </div>

                        <div className={styles.infoGroup}>
                            <label>Plan Purchase</label>
                            <p>{userData.planPurchase ? userData.planPurchase.toLocaleDateString() : 'N/A'}</p>
                        </div>

                        <div className={styles.infoGroup}>
                            <label>Plan Expiry</label>
                            <p>{userData.planExpiry ? userData.planExpiry.toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
           
        </>
    );
};

export default Profile;
