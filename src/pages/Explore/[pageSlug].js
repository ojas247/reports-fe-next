import { fetchDataFromGetApi } from '../api/Api';

export default function Insights({ page_data}) {
    console.log("blog_data:", page_data);

    return (
        <div>
            <h1>Explore</h1>
        </div>
    )
}


export async function getServerSideProps(context) {
    const { pageSlug } = context.params;
    console.log("pageSlug:", pageSlug);


    const page_data = await fetchDataFromGetApi("getExplorePageData?url=" + pageSlug);

    

    return {
        props: {
            page_data: page_data
        },
    };
}