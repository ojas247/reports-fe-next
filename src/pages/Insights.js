// pages/insights/index.tsx

import Link from 'next/link';
import styles from '../styles/Pages/insights.module.css';
import NavBar from '../components/Functionalities/NavBar';
import Footer from '../components/Website/Footer';
import algoliasearch from 'algoliasearch';
import Image from 'next/image';

export default function TestAlgoliaPage({ data }) {
    console.log(data.hits);
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
                            <Link href={`/Insights/${blog.contentSlug}`}>
                                <div className={styles.blogTileImg}> <Image src={blog.bannerImage} alt="Blog Banner" /></div>
                                <div className={styles.blogCatHeadline}><p>{blog.content.headline}</p></div>
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

    return {
        props: {
            data,
        },
    };
}

