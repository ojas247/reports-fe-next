// pages/insights/index.tsx

import Link from 'next/link';
import styles from '../styles/Pages/insights.module.css';
import NavBar from '../components/Functionalities/NavBar';
import Footer from '../components/Website/Footer';
import algoliasearch from 'algoliasearch';

export default function TestAlgoliaPage({ data }) {
    console.log(data.hits);
    const arrayBlogs = data.hits;

    return (
        <div className='blog-categories-cont'>
            {arrayBlogs.map((blog, index) => (
                <div className='blog-category-box' key={index}>
                    <Link href={`/Insights/${blog.contentSlug}`}>
                        <div className='blog-tile-img'> <img src={blog.bannerImage} alt="Blog Banner" /></div>
                        <div className='blog-cat-headline'><p>{blog.content.headline}</p></div>
                        <div className='blog-name'>
                            <ul className='blog-tile-pill1'>{blog.category}, </ul>
                            <ul className='blog-tile-pill2'>{blog.lastUpdate} </ul>
                        </div>
                    </Link>
                </div>

            ))}
        </div>
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

