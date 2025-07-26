// pages/insights/index.tsx

import Link from 'next/link';
import styles from '../styles/Pages/insights.module.css';
import NavBar from '../components/Functionalities/NavBar';
import Footer from '../components/Website/Footer';
import algoliasearch from 'algoliasearch';
import Image from 'next/image';

export default function Insights({ data }) {
    const arrayBlogs = data.hits;

    return (
        <>
            <NavBar />
            <div className={styles.mainContainerBlogs}>
                <div className={styles.pageTitle}>
                    <h3>Articles with our opinions, views and reports summaries</h3>
                </div>

                <div className={styles.blogCategoriesCont}>
                    {arrayBlogs.map((blog, index) => (
                        <div className={styles.blogCategoryBox} key={index}>
                            <Link href={`/Insights/${blog.category}/${blog.contentSlug}`}>
                                <div className={styles.blogTileImg}> <img src={blog.bannerImage} alt="Blog Banner"
                                    style={{ width: "100%", height: "auto", objectFit: "cover" }} />
                                </div>
                                <div className={styles.blogCatHeadline}>
                                <p>{blog.content.headline.slice(0, 50)}{blog.content.headline.length > 50 && '...'}</p>
                                </div>
                                <div className={styles.blogName}>
                                    <ul className={styles.blogTilePill1}>{blog.category}, </ul>
                                    <ul className={styles.blogTilePill2}>{blog.lastUpdate} </ul>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}

export async function getServerSideProps() {
    const res = await fetch('https://0K9MUXZLQ5.algolia.net/1/indexes/market_content', {
        cache: 'no-store',
        headers: {
            'x-algolia-api-key': 'b4ead66f0f82179adef08f30bce91fec',
            'x-algolia-application-id': '0K9MUXZLQ5',
        }
    });

    const data = await res.json();
    // const data = null;

    return {
        props: {
            data,
        },
    };
}

