import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import Breadcrumbs from '../../../components/UtilityComponents/Breadcrumbs';
import { useState } from "react";
import Navbar from "../../../components/Functionalities/NavBar";
import Footer from "../../../components/Website/Footer";
import { fetchDataFromGetApi } from '../../api/Api';
import RenderCSVgrid from "../../../components/UtilityComponents/RenderCSVgrid";
import GenericCharts from "../../../components/UtilityComponents/SEODataSets/GenericCharts";
import styles from "../../../styles/Pages/dataSlug.module.css";
import Papa from 'papaparse';
import { CreateUserId } from '../../api/UtilFunctions'


export default function DataSets({ bucketUrl, gridDescription, dataHeading, units, headerRow, dataRows, dataCategory, author, year,
    sector, subcategory, YouMayAlsoLike, slug, SourceURL, seoDesc, granularity }) {
    const frontendAPI = process.env.NEXT_PUBLIC_frontendAPI;
    const [email, setEmail] = useState('');
    const [PasswordPop, setPasswordPop] = useState('');
    const router = useRouter();
    const pageURL = frontendAPI + '/DataSets/' + sector + '/' + slug


    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'DataSets', href: '/DataSets' },
        { label: sector, href: '/DataSets/' + sector },
        { label: dataHeading } // no href = current page
    ];

    const breadcrumbItemsList = [
        {
            name: 'Home',
            url: frontendAPI,
        },
        {
            name: 'DataSets',
            url: frontendAPI + '/DataSets',
        },
        {
            name: sector,
            url: frontendAPI + '/DataSets/' + sector,
        },
        {
            name: dataHeading,
            url: frontendAPI + '/DataSets/' + sector + '/' + dataHeading,
        },
    ];

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItemsList.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    const dataSetSchema = {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": dataHeading,
        "description": gridDescription,
        "url":pageURL,
        "keywords": [dataCategory, dataHeading],
        "creator": {
            "@type": "Organization",
            "name": SourceURL
        },
        "publisher": {
            "@type": "Organization",
            "name": "https://marketreports.in/"
        },
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "distribution": {
            "@type": "DataDownload",
            "encodingFormat": "CSV",
            "contentUrl": bucketUrl
        },
        "datePublished": year
    }

    const articleSchema = {
        "@context": "http://schema.org",
        "@type": "Article",
        "headline": dataHeading,
        "author": {
            "@type": "Person",
            "name": author
        },
        "datePublished": year,
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
        "keywords": [dataCategory, dataHeading],
        "mainEntityOfPage": "https://marketreports.in/DataSets",
        "inLanguage": "EN",
        "isAccessibleForFree": "true",
        "datePublished": year,
        "dateModified": year,
        "description": gridDescription
    };

    const handleRegister = (event) => {
        event.preventDefault();
        CreateUserId(email, PasswordPop);

        // Show alert
        window.alert("Account created! Click OK and Login using your credentials.");
        router.push({
            pathname: '/Login',
        });
    };


    return (
        <>
            <Head>
                <meta name="description" content={seoDesc}></meta>
                <title>{dataHeading}</title>
                {/* <link rel="canonical" href={pageURL} /> */}
                {/* <meta name="robots" content="index, follow" /> */}
                
                <script type="application/ld+json">
                    {JSON.stringify(articleSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(dataSetSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Head>
            <Navbar />
            <div className="bg-gray-100 p-4 min-h-screen">
                <Breadcrumbs items={breadcrumbItems} />
                {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Data Set for {dataCategory}</h1> */}
                <div className="flex flex-row container mx-auto px-4 py-2">



                    {bucketUrl && dataHeading && gridDescription && (
                        <div className="max-w-[900px] overflow-x-auto">
                            <RenderCSVgrid headers={headerRow} rows={dataRows}
                                description={gridDescription} bucketUrl={bucketUrl} heading={dataHeading} units={units} granularity={granularity} />
                        </div>
                    )}


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
                                    className={styles.inputStyle}
                                />
                            </div>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={PasswordPop}
                                onChange={(e) => setPasswordPop(e.target.value)}
                                required
                                className={styles.inputStyle}
                            />

                            <button type="submit" onClick={handleRegister}>
                                Sign Up & Search
                                <span className={styles.icon}>🔍</span>
                            </button>
                        </form>
                    </div>

                </div>


                {bucketUrl && dataHeading && gridDescription && (
                    <div className="max-w-[900px] overflow-x-auto pl-8 pr-2 pt-2 pb-6">
                        <GenericCharts headers={headerRow} rows={dataRows}
                            description={gridDescription} bucketUrl={bucketUrl} heading={dataHeading} units={units} granularity={granularity} />
                    </div>
                )}

                <div className="max-w-[900px] w-full overflow-x-auto flex flex-col md:flex-row md:justify-center items-start md:items-center gap-2 px-2">
                    <h4 className="text-base md:text-base text-gray-800 underline-offset-2">
                        <i className="bi bi-pie-chart mr-1"></i>
                        Data Set - {subcategory} |
                    </h4>

                    <h4 className="text-base md:text-base text-gray-800 underline-offset-2">
                        <i className="bi bi-pencil-square mr-1"></i>
                        Author/Publisher - {author} |
                    </h4>

                    <Link href={SourceURL}>
                        <h4 className="text-base md:text-base text-gray-800 underline hover:text-blue-600">
                            <i className="bi bi-link mr-1"></i>
                            Source Data
                        </h4>
                    </Link>
                </div>


                <div className={styles.youMayLike}>
                    <h2>Other DataSets You May Like</h2>
                    <div className={styles.insightsRelatedArticles}>
                        {YouMayAlsoLike.map((item, index) => (
                            <div key={index} className={styles.insightsArticleCard}>
                                <Link href={frontendAPI + `/DataSets/${item.Sector}/${item.SlugURL}`}>
                                    <div className={styles.insightsArticleContent}>
                                        <h3>{item.DataName}</h3>
                                        <div className={styles.insightsArticleCategory}><div className={styles.insightsArticleCategoryText}>{item.category}</div></div>

                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
            <Footer />
        </>
    )
}

export async function getServerSideProps(context) {
    const { dataCategory, data } = context.params;

    const dataSetObj = await fetchDataFromGetApi("get-dataset-objs?count=&sector=&slug=" + data);
    const YouMayAlsoLike = await fetchDataFromGetApi("get-dataset-objs?count=5&slug=&sector=" + dataCategory);

        // ?.[0]?.ReportUrl);

    const bucketUrl = dataSetObj?.[0]?.ReportUrl;
    const gridDescription = dataSetObj?.[0]?.description;
    const dataHeading = dataSetObj?.[0]?.DataName;
    const author = dataSetObj?.[0]?.author;
    const year = dataSetObj?.[0]?.Year;
    const sector = dataSetObj?.[0]?.Sector;
    const subcategory = dataSetObj?.[0]?.Sub1;
    const units = dataSetObj?.[0]?.Units;
    const SourceURL = dataSetObj?.[0]?.SourceURL;
    const seoDesc = dataSetObj?.[0]?.seoDesc;
    const granularity = dataSetObj?.[0]?.granularity;
    let headerRow = null;
    let dataRows = null;


    if (bucketUrl) {
        // 2) Fetch and parse
        const response = await fetch(bucketUrl);
        if (!response.ok) {
            console.error('Failed to fetch CSV:', response.status);
            return { notFound: true };
        }
        const text = await response.text();

        // Parse using PapaParse
        const parsed = Papa.parse(text.trim(), {
            header: false,
            skipEmptyLines: true,
        });

        // 3) Separate header row and data rows
        [headerRow, ...dataRows] = parsed.data;
    }



    return {
        props: {
            slug: data,
            dataCategory: dataCategory,
            bucketUrl: bucketUrl,
            gridDescription: gridDescription,
            dataHeading: dataHeading,
            units: units,
            headerRow: headerRow,
            dataRows: dataRows,
            author: author,
            year: year,
            sector: sector,
            subcategory: subcategory,
            YouMayAlsoLike: YouMayAlsoLike,
            SourceURL: SourceURL,
            seoDesc: seoDesc,
            granularity: granularity
        }
    }


}