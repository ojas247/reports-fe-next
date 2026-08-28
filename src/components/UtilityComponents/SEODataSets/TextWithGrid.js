'use client';

import { useState, useEffect } from 'react';
import RenderEditableGrid from '../../../components/UtilityComponents/RenderEditableGrid';
import SingleDropDown from '../../../components/UtilityComponents/SingleDropdown';
import {
  fetchAuthors,
  fetchTags,
  fetchGranularity,
  fetchUnits,
} from '../../../pages/api/Api';
import SectorHierarchyDropDown from '../../../components/Functionalities/Admin/SectorHierarchyDropDown';

const TextWithGrid = (props) => {
const {
  id,
  onUpdate,
  sectorSub1Data = [],
  initialData = {},
  isTimeSeriesMandatory = false,
} = props;

  const [SecSubdata, setSecSubdata] = useState(sectorSub1Data);
const [componentData, setComponentData] = useState({
  sectorChain: {},
  dataName: "",
  sourceURL: "",
  dataDesc: "",
  seoDesc: "",
  year: "",
  authors: [],
  tags: [],
  units: "",
  granularity: "",
  isTSData: [],
  geo: [],
  tableData: [],
});
 const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [templateInsertIndex, setTemplateInsertIndex] = useState(null);

  const [Authordata, setAuthordata] = useState([]);
  const [Tagsdata, setTagsdata] = useState([]);

  const [GranularityData, setGranularityData] = useState({
    options_list: [],
  });

  const [UnitsData, setUnitsData] = useState({
    options_list: [],
  });

  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [metadataError, setMetadataError] = useState('');

  const templateOptions = [
    {
      value: '{{item(x)}}',
      label: '{{item(N)}} — Name of Item (ascending)',
    },
    {
      value: '{{latest0_date}}',
      label: '{{latest0_date}} — Last-(n) date in table',
    },
    {
      value: '{{item(2)_latest(0)}}',
      label: '{{item2_latest0}} — Value of item-2 as of last-(n) date',
    },
    {
      value: '{{units}}',
      label: '{{units}} — Table measurement units',
    },
    {
      value: '{{category}}',
      label: '{{category}} — Table category',
    },
    {
      value: '{{granularity}}',
      label: '{{granularity}} — Data granularity',
    },
    {
      value: '{{ArOps||item(1)_latest(0)/item(1)_latest(1)}}',
      label: '{{ArOps||...}} — Ratio of latest dates',
    },
    {
      value: '{{ArOps||item(1)_latest(0)-item(1)_latest(1)}}',
      label: '{{ArOps||...}} — Difference between latest dates',
    },
  ];

  useEffect(() => {
    if (
      props.initialData &&
      Object.keys(props.initialData).length > 0
    ) {
      setComponentData((prev) => ({
        ...prev,
        ...props.initialData,
      }));
    }
  }, [props.initialData]);

  useEffect(() => {
    setSecSubdata(sectorSub1Data);
  }, [sectorSub1Data]);

  const normalizeDropdownOptions = (response) => {
    if (!response) {
      return [];
    }

    let data = response;

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (error) {
        console.error('Unable to parse dropdown API response:', error);
        return [];
      }
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.options_list)) {
      return data.options_list;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data?.data?.options_list)) {
      return data.data.options_list;
    }

    if (Array.isArray(data?.authors)) {
      return data.authors;
    }

    if (Array.isArray(data?.tags)) {
      return data.tags;
    }

    if (Array.isArray(data?.items)) {
      return data.items;
    }

    return [];
  };

  useEffect(() => {
    const getUnitsAndGranularity = async () => {
      try {
        setLoadingMetadata(true);
        setMetadataError('');

        const [
          granularityResponse,
          unitsResponse,
        ] = await Promise.all([
          fetchGranularity(),
          fetchUnits(),
        ]);

        const granularityOptions =
          normalizeDropdownOptions(granularityResponse);

        const unitsOptions =
          normalizeDropdownOptions(unitsResponse);

        setGranularityData({
          options_list: granularityOptions,
        });

        setUnitsData({
          options_list: unitsOptions,
        });

        if (granularityOptions.length === 0) {
          console.warn('Granularity API returned no options.');
        }

        if (unitsOptions.length === 0) {
          console.warn('Units API returned no options.');
        }
      } catch (err) {
        console.error(
          'Error fetching Units or Granularity:',
          err
        );

        setMetadataError(
          err?.message ||
            'Failed to fetch Units and Granularity.'
        );

        setGranularityData({
          options_list: [],
        });

        setUnitsData({
          options_list: [],
        });
      } finally {
        setLoadingMetadata(false);
      }
    };

    getUnitsAndGranularity();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const OptionsAuthorData = await fetchAuthors();
        const OptionsTagsData = await fetchTags();

        setAuthordata(
          normalizeDropdownOptions(OptionsAuthorData)
        );

        setTagsdata(
          normalizeDropdownOptions(OptionsTagsData)
        );
      } catch (err) {
        console.error(
          'Error fetching author or tags data:',
          err
        );

        setAuthordata([]);
        setTagsdata([]);
      }
    };

    getData();
  }, []);

  useEffect(() => {
  if (onUpdate && id) {
    onUpdate(id, componentData);
  }
}, [componentData, id, onUpdate]);

  const isTSData = {
    options_list: ['Yes', 'No'],
  };

  const GeoData = {
    options_list: ['India', 'Global', 'MENA'],
  };

  const author_placeholder = 'Select Author';

  const updateField = (name, value) => {
    setComponentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getSectorFilters = (data) => {
    if (
      data &&
      typeof data === 'object' &&
      Object.keys(data).length > 0
    ) {
      updateField('sectorChain', data);
    }
  };

  const assignFormData = (e) => {
    updateField(
      e.target.name,
      e.target.value
    );
  };

  const handleDataDescChange = (e) => {
    const value = e.target.value;

    const cursorPos =
      e.target.selectionStart ?? value.length;

    setComponentData((prev) => ({
      ...prev,
      dataDesc: value,
    }));

    const justTyped = value.slice(
      cursorPos - 2,
      cursorPos
    );

    if (justTyped === '{{') {
      setShowTemplateDropdown(true);
      setTemplateInsertIndex(cursorPos - 2);
    }
  };

  const handleDataDescKeyDown = (e) => {
    if (
      e.key === 'Escape' &&
      showTemplateDropdown
    ) {
      e.stopPropagation();
      setShowTemplateDropdown(false);
      setTemplateInsertIndex(null);
    }
  };

  const handleTemplateSelect = (option) => {
    if (templateInsertIndex === null) {
      setShowTemplateDropdown(false);
      return;
    }

    setComponentData((prev) => {
      const current = prev.dataDesc || '';

      const before = current.slice(
        0,
        templateInsertIndex
      );

      const after = current.slice(
        templateInsertIndex + 2
      );

      return {
        ...prev,
        dataDesc:
          before +
          option +
          after,
      };
    });

    setShowTemplateDropdown(false);
    setTemplateInsertIndex(null);
  };

  const getDropDownData = (field, data) => {
  if (!Array.isArray(data)) {
    updateField(field, data ? [data] : []);
    return;
  }

  updateField(
    field,
    data
      .map((item) => {
        if (item && typeof item === 'object') {
          return item.value;
        }

        return item;
      })
      .filter(
        (item) =>
          item !== undefined &&
          item !== null &&
          item !== ''
      )
  );
};

  const getSingleDropDownData = (field, data) => {
  const value = data?.value ?? '';

  if (field === 'isTSData') {
    updateField(field, value ? [value] : []);
    return;
  }

  updateField(field, value);
};

  const saveTable = (tableData) => {
    updateField(
      'tableData',
      tableData
    );
  };

  const isUnitsSelected = Boolean(
    componentData.units
  );

  const isGranularitySelected = Boolean(
    componentData.granularity
  );

  const isTSDataSelected =
    Array.isArray(componentData.isTSData) &&
    componentData.isTSData.length > 0;

  const isGeoSelected =
    Array.isArray(componentData.geo) &&
    componentData.geo.length > 0;

  return (
    <div className="space-y-6 text-slate-900 font-sans pb-28 overflow-visible">

      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono">
            Dataset Details & Metadata
          </h3>

          <p className="text-[11px] text-slate-500 mt-0.5">
            Define metadata tags, taxonomy hierarchy, and grid values.
          </p>
        </div>
      </div>

      {metadataError && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700 font-mono">
          {metadataError}
        </div>
      )}

      <div className="bg-slate-50/60 p-3.5 rounded-lg border border-slate-200/80 relative z-20">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-2">
          Sector & Taxonomy Hierarchy
        </label>

        <SectorHierarchyDropDown
          preSelectedData={initialData.sectorChain}
          options={SecSubdata}
          onSelect={getSectorFilters}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="space-y-1.5">
          <label
            htmlFor="dataName"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono"
          >
            Data Name{' '}
            <span className="text-rose-500">*</span>
          </label>

          <input
            type="text"
            name="dataName"
            id="dataName"
            placeholder="e.g. India Energy Consumption Q3"
            value={componentData.dataName || ''}
            className="w-full bg-white border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 rounded-lg p-2.5 text-xs text-slate-900 transition outline-none font-medium"
            onChange={assignFormData}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="sourceURL"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono"
          >
            Source URL
          </label>

          <input
            type="text"
            name="sourceURL"
            id="sourceURL"
            placeholder="https://..."
            value={componentData.sourceURL || ''}
            className="w-full bg-white border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 rounded-lg p-2.5 text-xs text-slate-900 transition outline-none font-mono"
            onChange={assignFormData}
          />
        </div>

      </div>

      <div className="space-y-1.5">

        <div className="flex items-center justify-between">
          <label
            htmlFor="dataDesc"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono"
          >
            Overview of Data
          </label>

          <span className="text-[10px] text-slate-400 font-mono">
            Type{' '}
            <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">
              {'{{'}
            </code>{' '}
            for tokens
          </span>
        </div>

        <div className="relative">

          <textarea
            name="dataDesc"
            id="dataDesc"
            rows={3}
            placeholder="Describe the dataset..."
            value={componentData.dataDesc || ''}
            onChange={handleDataDescChange}
            onKeyDown={handleDataDescKeyDown}
            className="w-full bg-white border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 rounded-lg p-2.5 text-xs text-slate-900 transition outline-none leading-relaxed font-normal"
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height =
                e.target.scrollHeight + 'px';
            }}
          />

          {showTemplateDropdown && (
            <div className="absolute z-50 mt-1 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg max-h-52 overflow-y-auto divide-y divide-slate-100">

              <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-mono text-slate-500 uppercase font-semibold">
                Insert Token Option
              </div>

              {templateOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className="w-full text-left px-3 py-2 text-xs font-mono text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    handleTemplateSelect(opt.value)
                  }
                >
                  <span className="font-semibold text-slate-900">
                    {opt.value}
                  </span>

                  <span className="text-[10px] text-slate-400">
                    {opt.label}
                  </span>
                </button>
              ))}

            </div>
          )}

        </div>
      </div>

      <div className="space-y-1.5">

        <label
          htmlFor="seoDesc"
          className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono"
        >
          SEO Meta Description
        </label>

        <textarea
          name="seoDesc"
          id="seoDesc"
          rows={2}
          placeholder="Brief SEO summary for engine crawlers..."
          value={componentData.seoDesc || ''}
          onChange={assignFormData}
          className="w-full bg-white border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 rounded-lg p-2.5 text-xs text-slate-900 transition outline-none leading-relaxed font-normal"
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height =
              e.target.scrollHeight + 'px';
          }}
        />

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 relative z-30">

        <div className="space-y-1.5">

          <label
            htmlFor="year"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono"
          >
            Data Published On
          </label>

        <input
          type="month"
          name="monthYear"
          id="monthYear"
          value={componentData.year || ''}
          onChange={assignFormData}
            className="w-full bg-white border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 rounded-lg p-2 text-xs text-slate-900 transition outline-none font-mono"
          />

        </div>

        <div className="space-y-1.5 relative z-40">

          <label
            htmlFor="authors"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono"
          >
            Authors
          </label>

          <div className="text-slate-900 font-medium">

            <SingleDropDown
              isMulti={true}
              options={Authordata}
              placeholder={author_placeholder}
              value={componentData.authors || []}
              onSelect={(data) =>
                getDropDownData(
                  'authors',
                  data
                )
              }
            />

          </div>

        </div>

        <div className="space-y-1.5 relative z-40">

          <label
            htmlFor="tags"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono"
          >
            Tags
          </label>

          <div className="text-slate-900 font-medium">

            <SingleDropDown
              options={Tagsdata}
              isMulti={true}
              value={componentData.tags || []}
              onSelect={(data) =>
                getDropDownData(
                  'tags',
                  data
                )
              }
            />

          </div>

        </div>

      </div>

<div className="pt-4">
    <div className="border-t border-slate-100 pt-4 mb-3 flex items-center justify-between">
    <h4 className="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono">
      Structured Data Table
    </h4>
  </div>

<div
  className="bg-slate-50/70 p-4 border border-slate-200 rounded-xl text-slate-900 space-y-4 shadow-2xs"
  style={{ overflow: 'visible' }}
>
  <div className=" text-slate-900 font-medium">
      <RenderEditableGrid
        oldTableData={componentData.tableData}
        onSave={saveTable}
      />
    </div>
  </div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 relative z-10">
        <div className="space-y-1.5 relative z-50">

          <label
            htmlFor="units"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono flex items-center gap-1"
          >
            <span>Units</span>
            <span className="text-rose-500 font-bold">*</span>
          </label>

          <div className="text-slate-900 font-medium rounded-lg">

            <SingleDropDown
              options={UnitsData}
              isMulti={false}
              value={componentData.units || null}
              onSelect={(data) =>
                getSingleDropDownData(
                  'units',
                  data
                )
              }
            />

          </div>

          {loadingMetadata && (
            <p className="text-[9px] text-slate-400 font-mono">
              Loading units...
            </p>
          )}

          {!loadingMetadata &&
            UnitsData.options_list.length === 0 && (
              <p className="text-[9px] text-rose-500 font-mono">
                No units available
              </p>
            )}

        </div>

        <div className="space-y-1.5 relative z-50">

          <label
            htmlFor="granularity"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono flex items-center gap-1"
          >
            <span>Granularity</span>
            <span className="text-rose-500 font-bold">*</span>
          </label>

          <div className="text-slate-900 font-medium rounded-lg">

            <SingleDropDown
              options={GranularityData}
              isMulti={false}
              value={componentData.granularity || null}
              onSelect={(data) =>
                getSingleDropDownData(
                  'granularity',
                  data
                )
              }
            />

          </div>

          {loadingMetadata && (
            <p className="text-[9px] text-slate-400 font-mono">
              Loading granularity...
            </p>
          )}

          {!loadingMetadata &&
            GranularityData.options_list.length === 0 && (
              <p className="text-[9px] text-rose-500 font-mono">
                No granularity options available
              </p>
            )}

        </div>

        <div className="space-y-1.5 relative z-50">

          <label
            htmlFor="isTSData"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono flex items-center gap-1"
          >
            <span>Is Time Series</span>
            <span className="text-rose-500 font-bold">*</span>
          </label>

          <div className="text-slate-900 font-medium rounded-lg">

        <SingleDropDown
  options={isTSData}
  isMulti={false}
  value={
    componentData.isTSData?.[0]
      ? {
          value: componentData.isTSData[0],
          label: componentData.isTSData[0],
        }
      : null
  }
  onSelect={(data) =>
    getSingleDropDownData('isTSData', data)
  }
/>
          </div>

        </div>

        <div className="space-y-1.5 relative z-50">

          <label
            htmlFor="geo"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono flex items-center gap-1"
          >
            <span>Geography</span>
            <span className="text-rose-500 font-bold">*</span>
          </label>

          <div className="text-slate-900 font-medium rounded-lg">

            <SingleDropDown
              options={GeoData}
              isMulti={true}
              value={componentData.geo || []}
              onSelect={(data) =>
                getDropDownData(
                  'geo',
                  data
                )
              }
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default TextWithGrid;