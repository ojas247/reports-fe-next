import Image from "next/image";
import Head from 'next/head';
import Link from "next/link";
import Navbar from "../components/Functionalities/NavBar";
import Footer from "../components/Website/Footer";

export default function DataSets({ data }) {
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
    const imageURLs = ['https://storage.googleapis.com/marketreports/Blogs/Banners/DeepTech1.jpg',
        'https://storage.googleapis.com/marketreports/Blogs/Banners/Trading.png'
    ]


    return (
        <>
            <Head>
                <title>Download DataSets for Visualization and Analytics</title>
            </Head>
            <Navbar />
            <div className="bg-gray-100 p-4 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6">Sample Data-Sets across 70 sectors from 150+ sources</h1>
                </div>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            // className="break-inside-avoid rounded-2xl overflow-hidden shadow-md bg-white transition duration-300 hover:shadow-xl"
                            className="break-inside-avoid rounded-2xl overflow-hidden shadow-md bg-white transition-all duration-500 ease-in-out hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                            <Link href={`/DataSets/${item.Sector}/${item.SlugURL}`}>
                                {/* <Image
                                    src={imageURLs[index % imageURLs.length]}
                                    width={400} // set actual width
                                    height={192} // maintain 400x192 for ~16:9 ratio
                                    className="w-full h-48 object-cover rounded-t-2xl"
                                    alt={item.DataName}
                                /> */}
                                <div className="p-4">
                                    <div>
                                        <span className="px-3 py-1 text-[8px] bg-purple-100 text-purple-800 rounded-full">
                                            {item.Sector} → {item.Sub1}
                                        </span>
                                    </div>

                                    <h2 className="text-lg font-semibold text-gray-600 leading-snug py-1">
                                        {item.DataName}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {item.description?.slice(0, 120) || ''}
                                    </p>

                                    <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
                                        <span>{item.author || ''}</span>
                                        <span>{item.Year || '2 months ago'}</span>
                                    </div>
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

export async function getServerSideProps() {
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

    const res = await fetch(`${backendAPI}/get-dataset-objs?count=10`, {
        cache: 'no-store',
        headers: {
            'content-type': 'application/json'
        }
    });

    const data = await res.json();
    console.log("check: ", data)

    return {
        props: {
            data,
        },
    };
}