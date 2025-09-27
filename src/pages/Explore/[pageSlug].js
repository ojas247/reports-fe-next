import { fetchDataFromGetApi } from '../api/Api';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NavBar from "../../components/Functionalities/NavBar";
import Footer from "../../components/Website/Footer";
import LeadForm from '@/components/Website/LeadForm';
import CompsRenderExplorePg from '@/components/UtilityComponents/SEODataSets/Pages/CompsRenderExplorePg'

export default function Insights({ page_data }) {
    console.log("page_data:", page_data);

    const page_data1 = [
        {
            compName: "pageHeader",
            compData: {
                PageName: "My Page",
                pageDataDesc: "This is a sample description",
                pageSeoDesc: "SEO friendly text here",
                sectorChain: { Sector: "FinTech", Sub1: "Payments" },
                tags: ["Case Study", "Financials"]
            }
        },
        {
            compName: "txtWithTitle",
            compData: '{"title":"Hello World","text":"This is a text block"}'
        },
        {
            compName: "txtGrid",
            compData: {
                dataName: "Heart Report",
                units: "%",
                tableData: [
                    ["Col1", "Col2", "Col3"],
                    ["1", "2", "3"],
                    ["4", "5", "6"]
                ]
            }
        }
    ];




    return (
        <>
            <NavBar />
            <div className="flex w-full">
                <div className="w-3/4 p-4">
                    <CompsRenderExplorePg pageCompArray={page_data} />
                </div>
                <div className="w-1/4 p-4">
                    <div className="sticky top-4">
                        <LeadForm />
                    </div>
                </div>
            </div>

            <Footer />
        </>
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