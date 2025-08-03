import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import Navbar from "../../components/Functionalities/NavBar";
import Footer from "../../components/Website/Footer";
import fetchSetorSubOptions from "../../pages/api/Api";

export default function DataCategoryPage({ data, dataCategory }) {
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
    const imageURLs = ['https://storage.googleapis.com/marketreports/Blogs/Banners/DeepTech1.jpg',
        'https://storage.googleapis.com/marketreports/Blogs/Banners/Trading.png'
    ]


    return (
        <>
            <Head>
                <meta name="description" content={`Downloadable csv datasets of various domains from the ${dataCategory} sector`}/>
                <title>{`Downloadable csv datasets of ${dataCategory}`}</title>
            </Head>

            <Navbar />
            <div className="bg-gray-100 p-4 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">DataSet Overview on {dataCategory}</h1>
                </div>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="break-inside-avoid rounded-2xl overflow-hidden shadow-md bg-white transition duration-300 hover:shadow-xl"
                        >
                            <Link href={`/DataSets/${item.Sector}/${item.SlugURL}`}>
                                <Image
                                    src={imageURLs[index % imageURLs.length]}
                                    width={400} // set actual width
                                    height={192} // maintain 400x192 for ~16:9 ratio
                                    className="w-full h-48 object-cover rounded-t-2xl"
                                    alt={item.DataName}
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold text-gray-800 leading-snug">
                                        {item.DataName}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-2">
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

export async function getServerSideProps(context) {
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
    const { dataCategory } = context.params;

    const res = await fetch(`${backendAPI}/get-dataset-objs?count=&slug=&sector=${dataCategory}`, {
        cache: 'no-store',
        headers: {
            'content-type': 'application/json'
        }
    });



    const data = await res.json();
    console.log("CheckData: ", data);

    return {
        props: {
            dataCategory,
            data,
        },
    };
}