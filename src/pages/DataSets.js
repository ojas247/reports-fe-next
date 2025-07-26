import Image from "next/image";
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
            <Navbar />
            <div className="bg-gray-100 p-4 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Data Sets</h1>
                </div>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="break-inside-avoid rounded-2xl overflow-hidden shadow-md bg-white transition duration-300 hover:shadow-xl"
                        >
                            <Link href={`/DataSets/${item.SlugURL}`}>
                                <Image
                                    src={imageURLs[index % imageURLs.length]}
                                    width={400} // set actual width
                                    height={192} // maintain 400x192 for ~16:9 ratio
                                    className="w-full h-48 object-cover rounded-t-2xl"
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

export async function getServerSideProps() {
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

    const res = await fetch(`${backendAPI}/get-dataset-objs?count=10&slug=&sector=`, {
        cache: 'no-store',
        headers: {
            'content-type': 'application/json'
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