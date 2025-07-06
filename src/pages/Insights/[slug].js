import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NavBar from "../../components/Functionalities/NavBar";
import Footer from "../../components/Website/Footer";
import algoliasearch from 'algoliasearch';
import parse from 'html-react-parser';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';
import { CreateUserId } from '../../pages/api/UtilFunctions';
import { fetchDataFromGetApi } from '../../pages/api/Api';
import Link from 'next/link';
import styles from '../../styles/Pages/insightSlug.module.css';
import Image from 'next/image';

export default function Insights({ blog_data }) {
    const frontendAPI = process.env.NEXT_PUBLIC_FRONTEND_API;
    const [found, setFound] = useState(null);

    const [showPopup, setShowPopup] = useState(false); // for popup
    const [email, setEmail] = useState('');
    const [PasswordPop, setPasswordPop] = useState('');
    const [authenticationFailed, setAuthenticationFailed] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const type = "Article";

    const articleSchema = {
        "@context": "http://schema.org",
        "@type": "Article",
        "headline": blog_data.content.headline,
        "author": {
            "@type": "Person",
            "name": blog_data.authorName
        },
        "datePublished": blog_data.datePublished,
        "image": {
            "@type": "ImageObject",
            "width": 1000,
            "url": blog_data.SEOImage
        },
        "publisher": {
            "@id": "https://marketreports.in",
            "@type": "Organization",
            "name": "MarketReports-by SYNTHESIS",
            "logo": {
                "@type": "ImageObject",
                "url": "https://storage.googleapis.com/marketreports/Brand/Logo/Logo-Trans.svg",
                "width": "600",
                "height": "60"
            }
        },
        "keywords": `${blog_data.category}, Market Research, Market Reports, Industry Reports `,
        "mainEntityOfPage": "https://marketreports.in/Insights",
        "inLanguage": "EN",
        "isAccessibleForFree": "true",
        "datePublished": blog_data.datePublished,
        "dateModified": blog_data.dateModified,
        "description": blog_data.metaDescription
    };

    const websiteSchema = {
        "@context": "http://schema.org",
        "@type": "WebSite",
        "url": "https://marketreports.in",
        "name": "MarketReports-by SYNTHESIS",
        "potentialAction": {
            "@type": "ReadAction",
            "target": 'https://marketreports.in/Insights/' + blog_data.contentSlug
        },
        "publisher": {
            "@type": "Organization",
            "name": "MarketReports-by SYNTHESIS",
            "logo": {
                "@type": "ImageObject",
                "url": "https://storage.googleapis.com/marketreports/Brand/Logo/Logo-Trans.svg",
                "width": 600,
                "height": 60
            }
        }
    };

    const imageSchema = {
        "@context": "http://schema.org",
        "@type": "ImageObject",
        "url": blog_data.SEOImage,
        "caption": blog_data.metaDescription,
        "width": 1000,
        "height": 300
    };

    const popupStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };
    const popupContentStyle = {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        width: '30%',
    };
    const inputStyle = {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    };
    const buttonStyle = {
        padding: '10px 20px',
        margin: '10px 10px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };
    const closeBtnStyle = {
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        padding: '5px',
        cursor: 'pointer',
        borderRadius: '5px',
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '1px 10px'
    };


    useEffect(() => {
        let randomNum = Math.floor(Math.random() * (30 - 7)) + 7; //gives a random number b/w 7 and 30
        let currentDate = new Date();
        let modifiedUpdatedDate = new Date();
        modifiedUpdatedDate.setDate(currentDate.getDate() - 7);
        // setDateModified(modifiedUpdatedDate);

        async function fetchSuggestions() {
            const response = await fetchDataFromGetApi("youMayAlsoLike?url=" + blog_data.contentSlug);
            setSuggestions(response.suggestions || []);
        }
        fetchSuggestions();

        const handleScroll = () => {
            // Check if the user has our cookiee in its browser
            if (localStorage.getItem('token') == null) {
                // Check if user has scrolled to the bottom
                if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
                    setShowPopup(true);
                    console.log("Reached bottom");
                }
            }
        };
        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogin = (event) => {
        event.preventDefault();
        // Encrypt the password before sending
        // const encryptedPassword = encryptPassword(PasswordPop);

        axios.post(`${backendAPI}/UserLogin`, {
            username: email,
            password: PasswordPop
        })
            .then((response) => {
                console.log("Token:  ", response.data);
                setShowPopup(false);
                localStorage.setItem('token', response.data);
                navigate('/', { state: {} });

                if (response.data === "Incorrect Credentials or Try Registering") {
                    setAuthenticationFailed(true);
                    console.log("authenticationFailed: ", authenticationFailed);
                }

            }, (error) => {
                console.log(error);
                setAuthenticationFailed(true);
            });

    }

    const handleRegister = (event) => {
        event.preventDefault();
        // Encrypt the password before sending
        // const encryptedPassword = encryptPassword(PasswordPop);
        CreateUserId(email, PasswordPop);
        navigate('/Login', { state: { "message": "User Created Successfully. Please Login to Continue." } });
        setShowPopup(false); // Close the pop-up after submission
    };


    return (
        <>
            <Head>
                {/* Inject JSON-LD schema into the head of the document */}
                <script type="application/ld+json">
                    {JSON.stringify(articleSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(websiteSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(imageSchema)}
                </script>
                <meta name="description" content={blog_data.metaDescription}></meta>
                <title>{blog_data.title}</title>
            </Head>
            <NavBar />
            <div className={styles.insightsContainer}>
                <div className={styles.articleTitle}> <h1>{blog_data.content.headline}</h1>
                </div>

                <div className={styles.articleBannerImg}>
                    <Image className={styles.articleImg} fetchPriority="high"
                        src={blog_data.bannerImage} alt="MarketReport on Industries" fill></Image>
                </div>

                <div className={styles.articleAuthorContainer}>
                    <Image className={styles.authorImg} fetchPriority="high"
                        src={blog_data.authorImage} alt="Blog Author" width={80} height={80} /> 
                    <div className={styles.authorDetails}><p className={styles.authorName}>{blog_data.authorName}</p>
                        <p className={styles.lastUpdate}>{blog_data.lastUpdate}</p></div>

                </div>

                <div className={styles.articleContentContainer}>
                    <div className={styles.articleContent}>
                        {parse(blog_data.content.mainBody)
                        }
                    </div>

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
                    </div>

                </div>
                <div className={styles.articleTags}></div>
                {showPopup && (
                    <div style={popupStyle}>
                        <div style={popupContentStyle}>
                            <button onClick={() => setShowPopup(false)} style={closeBtnStyle}> X </button>
                            <h2>Register & Subscribe</h2>
                            <p>We charge so low, you wouldn&apos;t bother to pay</p>
                            {/* <form onSubmit={handleSubmit}> */}
                            <form>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={inputStyle}
                                />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={PasswordPop}
                                    onChange={(e) => setPasswordPop(e.target.value)}
                                    required
                                    style={inputStyle}
                                />
                                <button type="submit" style={buttonStyle} onClick={handleLogin}>Log-in</button>
                                <button type="submit" style={buttonStyle} onClick={handleRegister}>Signup</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.youMayLike}>
                <h2>Other Articles You May Like</h2>
                <div className={styles.insightsRelatedArticles}>
                    {suggestions.map((item, index) => (
                        <div key={index} className={styles.insightsArticleCard}>
                            <Link href={frontendAPI + `/Insights/${item.url}`}>
                                <div className={styles.insightsArticleContent}>
                                    <h3>{item.title}</h3>
                                    <div className={styles.insightsArticleCategory}><div className={styles.insightsArticleCategoryText}>{item.category}</div></div>

                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />

        </>
    )
}

/////////////////////////////////SERVER SIDE PROPS //////////////////////////////////
export async function getServerSideProps(context) {
    const { slug } = context.params;
    console.log("SlugFetched:", slug);

    const res = await fetch('https://0K9MUXZLQ5.algolia.net/1/indexes/market_content/' + slug, {
        headers: {
            'x-algolia-api-key': 'b4ead66f0f82179adef08f30bce91fec',
            'x-algolia-application-id': '0K9MUXZLQ5',
        }
    });

    const blog_data = await res.json();

    return {
        props: {
            blog_data,
        },
    };
}




