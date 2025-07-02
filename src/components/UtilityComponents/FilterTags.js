import React from 'react';
import styles from '../../styles/filterTags.module.css';

const FilterTags = (props) => {
  //const data = { "year": [{ "label": 2022, "value": 2022 }, { "label": 2023, "value": 2023 }], "author": [{ "label": "Govt. of India", "value": "Govt. of India" }, { "value": "Bernstein", "label": "Bernstein" }], "tags": [{ "value": "valuation", "label": "valuation" }, { "value": "Market Size", "label": "Market Size" }], "sector_filters": { "sub1": "Higher Education, Literacy", "sector": "EdTech" } }
  const data = props.applied_filters;
  let years = [];
  let authors = []; 
  let tags = [];

  console.log("filterTagsdata: ", data);
  if (data.year){ years = data.year.map(item => item.value); }
  if (data.author){ authors = data.author.map(item => item.value); }
  if (data.tags){ tags = data.tags.map(item => item.value); }


  const sector = data.sector_filters?.sector ? data.sector_filters.sector : null;
  // const sub10 = data.sector_filters?.sub1 ? sub1.split(", ").map(item => item.trim()) : null;
  const sub1 = data.sector_filters?.sub1 ? data.sector_filters.sub1.split(", ").map(item => item.trim()) : null;


  return (
    <div>
      <div className={styles.pillBtn + " " + styles.sectorBtn}>
        <small>{sector}</small>
      </div>
      <div className={styles.pillBtn + " " + styles.sectorBtn}>
        <small>{sub1}</small>
      </div>
      {authors.map(author => (
        <div key={author} className={styles.pillBtn + " " + styles.authorBtn}>
          <small>{author}</small>
        </div>
      ))}
      {years.map(year => (
        <div key={year} className={styles.pillBtn + " " + styles.yearBtn}>
          <small>{year}</small>
        </div>
      ))}
      {tags.map(tag => (
        <div key={tag} className={styles.pillBtn + " " + styles.tagBtn}>
          <small>{tag}</small>
        </div>
      ))}
    </div>
  );
  
}

export default FilterTags;
