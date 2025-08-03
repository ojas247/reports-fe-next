// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Link from 'next/link';
// import Head from 'next/head';
// import NavBar from "../../components/Functionalities/NavBar";
// import Footer from "../../components/Website/Footer";
// import algoliasearch from 'algoliasearch';
// import parse from 'html-react-parser';
// import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';
// import { CreateUserId } from '../api/UtilFunctions';
// import { fetchDataFromGetApi } from '../api/Api';
// import styles from '../../styles/Pages/insights.module.css';

// export default function CategoryPage({ blog_list }) {
//   const arrayBlogs = blog_list.hits;

//   return (
//     <>
//       <NavBar />
//       <div className={styles.mainContainerBlogs}>
//         <div className={styles.pageTitle}>
//           <h3>Articles with our opinions, views and reports summaries</h3>
//         </div>

//         <div className={styles.blogCategoriesCont}>
//           {arrayBlogs.map((blog, index) => (
//             <div className={styles.blogCategoryBox} key={index}>
//               <Link href={`/Insights/${blog.contentSlug}`}>
//                 <div className={styles.blogTileImg}> <img src={blog.bannerImage} alt="Blog Banner"
//                   style={{ width: "100%", height: "auto", objectFit: "cover" }} />
//                 </div>
//                 <div className={styles.blogCatHeadline}>
//                   <p>{blog.content.headline.slice(0, 50)}{blog.content.headline.length > 50 && '...'}</p>
//                 </div>
//                 <div className={styles.blogName}>
//                   <ul className={styles.blogTilePill1}>{blog.category}, </ul>
//                   <ul className={styles.blogTilePill2}>{blog.lastUpdate} </ul>
//                 </div>
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }


// export async function getServerSideProps(context) {
//   const { category } = context.params;
//   console.log("CategoryFetched:", category);

//   const res = await fetch('https://0K9MUXZLQ5.algolia.net/1/indexes/market_content/query', {
//     method: 'POST',
//     headers: {
//       'x-algolia-api-key': 'b4ead66f0f82179adef08f30bce91fec',
//       'x-algolia-application-id': '0K9MUXZLQ5',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       params: new URLSearchParams({
//         query: '', // empty string = return all for the facet
//         facets: 'category,author',
//         facetFilters: [`category:${category}`], // array required
//       }).toString(),
//     }),
//   });

//   const blog_list = await res.json();

//   return {
//     props: {
//       blog_list,
//     },
//   };
// }


export default function CategoryPage() { 
    return (
        <div>
            <h1>Category Page</h1>
        </div>
    )
}

// Commented on 3rd Aug 2025