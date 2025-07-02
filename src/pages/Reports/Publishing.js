import React, { useState, useEffect } from 'react';
import SingleDropDown from "../../components/UtilityComponents/SingleDropdown";
import CascadingDropDown from "../../components/UtilityComponents/CascadingDropdown";
import { fetchSetorSubOptions, fetchAuthors, fetchYears, fetchTags } from "../api/Api.js";
import axios from 'axios';
import styles from "../../styles/Pages/Admin/publishing.module.css";
import Image from 'next/image';

function ReportPublishingForm() {
  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
  const [response, setResponse] = useState(null);
  const [SecSubdata, setSecSubdata] = useState([]);
  const [Authordata, setAuthordata] = useState([]);
  const [Tagsdata, setTagsdata] = useState([]);
  const [Yeardata, setYeardata] = useState([]);
  const [files, setFiles] = useState(null);
  const [fileName, setFileName] = useState('');
  const [formRegister, setRegister] = useState({
    reportName: "",
    sector: "",
    sub1: "",
    author: "",
    year: "",
    sourceURL: ""
  });

  const GeoData = { "options_list": ["India", "Global", "MENA"] }
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    async function getData() {
      const OptionsSub1actualData = await fetchSetorSubOptions();
      setSecSubdata(OptionsSub1actualData);

      const OptionsAuthorData = await fetchAuthors();
      setAuthordata(OptionsAuthorData);

      const OptionsTagsData = await fetchTags();
      setTagsdata(OptionsTagsData);

      const OptionsYearData = await fetchYears();
      setYeardata(OptionsYearData);
    }
    getData()
  }, [])

  if (SecSubdata.length === 0 || Authordata.length === 0 || Yeardata.length === 0) {
    return <div>Loading...</div>;
  }


  const author_placeholder = "Select Author"

  const getFileDetails = (data) => {
    const selectedFile = data.target.files[0];
    setFiles(selectedFile);
    setFileName(selectedFile.name); // Set the file name
  }

  const getAuthor = (data) => {
    setRegister({ ...formRegister, author: data.map(item => item.value) });
  }

  const getTags = (data) => {
    setRegister({ ...formRegister, tag: data.map(item => item.value) });
  }

  const getGeo = (data) => {
    setRegister({ ...formRegister, geo: data.map(item => item.value) });
  }

  const getSectorFilters = (data) => {
    setRegister({ ...formRegister, sub1: data.sub1, sector: data.sector });
  }

  const assignFormData = (e) => {
    e.persist();
    setRegister({ ...formRegister, [e.target.name]: e.target.value });
    console.log("Assign", e.target.value);
  }

  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    setLoading(true);

    // Read the form data
    const form = e.target;
    const formData = new FormData();
    formData.append('files', files); // Append the file
    formData.append('fileName', fileName);

    Object.entries(formRegister).forEach(([key, value]) => {
      formData.append(key, value);
      console.log("Key/Val", key, value);
    });

    axios.post(`${backendAPI}/Publishing`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })
      .then(res => {
        console.log("resData", res.data);
        setResponse(res.data);
      })
      .finally(() => {
        setLoading(false); // Stop the loader
      });

  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>Publishing Reports</h1>
      <form method="post" onSubmit={handleSubmit} className={styles.formContainer}>
        {/* Sector Dropdown */}
        <div className={styles.formGroup}>
          <CascadingDropDown options={SecSubdata} onSelect={getSectorFilters} />
        </div>

        <div className={styles.reportPub}>

          {/* Report Name Field */}
          <div className={styles.fieldPub}>
            <label htmlFor="reportName">Report Name:</label>
            <input
              type="text"
              name="reportName"
              id="reportName"
              defaultValue="reportName"
              onChange={assignFormData}
            />
          </div>

          {/* File Upload Field */}
          <div className={styles.fieldPub}>
            <label htmlFor="files">Upload PDF:</label>
            <input
              type="file"
              name="files"
              id="files"
              accept="application/pdf"
              required
              onChange={getFileDetails}
            />
          </div>

          {/* Year Field */}
          <div className={styles.fieldPub}>
            <label htmlFor="year">Year:</label>
            <input
              type="number"
              name="year"
              id="year"
              defaultValue="Year"
              onChange={assignFormData}
            />
          </div>

          {/* Author Dropdown */}
          <div className={styles.fieldPub}>
            <label htmlFor="author">Author:</label>
            <SingleDropDown
              options={Authordata}
              placeholder={author_placeholder}
              onSelect={getAuthor}
            />
          </div>

          {/* Tags Dropdown */}
          <div className={styles.fieldPub}>
            <label htmlFor="tags">Tags:</label>
            <SingleDropDown options={Tagsdata} onSelect={getTags} />
          </div>

          {/* Source URL Field */}
          <div className={styles.fieldPub}>
            <label htmlFor="sourceURL">Source URL:</label>
            <input
              type="text"
              name="sourceURL"
              id="sourceURL"
              defaultValue="SourceURL"
              onChange={assignFormData}
            />
          </div>

          {/* Geo Dropdown */}
          <div className={styles.fieldPub}>
            <label htmlFor="geo">Geography:</label>
            <SingleDropDown options={GeoData} onSelect={getGeo} />
          </div>

          {/* Reset and Submit Buttons */}
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitBtn}>Submit form</button>
            <button type="reset" className={styles.resetBtn}>Reset form</button>
          </div>

        </div>

        {/* Loader */}
        {loading && (
          <div className={styles.loaderContainer}>
            <Image src="/Assets/Gifs/loading.gif" alt="Loading..." width="100" height="80" />
            <p>Uploading Reports...</p>
          </div>
        )}

        {response && (
          <div className={styles.responseContainer}>
            <p>{response}</p>
          </div>
        )}
      </form>
    </div>

  );
}

export default ReportPublishingForm;