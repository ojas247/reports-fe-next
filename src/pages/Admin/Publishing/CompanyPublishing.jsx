import { useState } from 'react';

export default function CompanyPublishing() {
  const [companyName, setCompanyName] = useState('');
  const [symbol, setSymbol] = useState('');

  const [rawMaterials, setRawMaterials] = useState([]);
  const [outputProducts, setOutputProducts] = useState([]);
  const [leadingIndicators, setLeadingIndicators] = useState([]);
  const [laggingIndicators, setLaggingIndicators] = useState([]);
const [error, setError] = useState('');
const [success, setSuccess] = useState(false);
  const [rawMaterialInput, setRawMaterialInput] = useState('');
  const [outputProductInput, setOutputProductInput] = useState('');
  const [leadingIndicatorInput, setLeadingIndicatorInput] = useState('');
  const [laggingIndicatorInput, setLaggingIndicatorInput] = useState('');

  const [publishing, setPublishing] = useState(false);


  const addItem = (input, setInput, items, setItems) => {
    const value = input.trim();

    if (!value) return;

    if (items.includes(value)) {
      setInput('');
      return;
    }

    setItems((prev) => [...prev, value]);
    setInput('');
  };

  const removeItem = (item, setItems) => {
    setItems((prev) => prev.filter((value) => value !== item));
  };

  const handleKeyDown = (
    e,
    input,
    setInput,
    items,
    setItems
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      addItem(
        input,
        setInput,
        items,
        setItems
      );
    }
  };

const handlePublish = async () => {
  setError('');
  setSuccess(false);

  if (!companyName.trim()) {
    setError('Company name is required.');
    return;
  }

  if (!symbol.trim()) {
    setError('Company symbol is required.');
    return;
  }

  if (rawMaterials.length === 0) {
    setError('Add at least one raw material.');
    return;
  }

  if (outputProducts.length === 0) {
    setError('Add at least one output product.');
    return;
  }

  try {
    setPublishing(true);

    const payload = {
      company_name: companyName.trim(),
      symbol: symbol.trim().toUpperCase(),
      raw_materials: rawMaterials,
      output_products: outputProducts,
      leading_indicators: leadingIndicators,
      lagging_indicators: laggingIndicators,
    };

    const backendAPI =
      process.env.NEXT_PUBLIC_backendAPI ||
      'http://localhost:8080';

    const response = await fetch(
      `${backendAPI}/Publishing/Company_v1`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        errorText ||
        `Publishing failed with status ${response.status}`
      );
    }

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);

  } catch (err) {
    console.error('Company publishing error:', err);

    setError(
      err?.message ||
      'Unable to publish company configuration.'
    );
  } finally {
    setPublishing(false);
  }
};

 const clearForm = () => {
  setCompanyName('');
  setSymbol('');

  setRawMaterials([]);
  setOutputProducts([]);
  setLeadingIndicators([]);
  setLaggingIndicators([]);

  setRawMaterialInput('');
  setOutputProductInput('');
  setLeadingIndicatorInput('');
  setLaggingIndicatorInput('');

  setError('');
  setSuccess(false);
};

  const renderTagSection = ({
    label,
    description,
    input,
    setInput,
    items,
    setItems,
    placeholder,
  }) => (
    <div className="border-b border-slate-100 last:border-b-0">
      <div className="grid grid-cols-1 md:grid-cols-3">

        <div className="px-4 py-3 bg-[#f8f9fa] border-r border-slate-100">
          <div className="text-[11px] font-semibold text-slate-700">
            {label}
          </div>

          <div className="text-[9px] text-slate-400 mt-1 leading-relaxed">
            {description}
          </div>
        </div>

        <div className="p-3 md:col-span-2">

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  input,
                  setInput,
                  items,
                  setItems
                )
              }
              placeholder={placeholder}
              className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
            />

            <button
              type="button"
              onClick={() =>
                addItem(
                  input,
                  setInput,
                  items,
                  setItems
                )
              }
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700 transition"
            >
              ADD
            </button>
          </div>

          {items.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {items.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600"
                >
                  {item}

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(item, setItems)
                    }
                    className="text-slate-400 hover:text-red-500 transition"
                    title={`Remove ${item}`}
                  >
                    <i className="bi bi-x text-[11px]" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="text-[9px] text-slate-400 font-mono mt-2">
              NO ITEMS ADDED
            </div>
          )}

        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold shadow-2xs">
            CP
          </div>

          <div>
            <div className="flex items-center gap-2">

              <h1 className="text-sm font-semibold tracking-tight text-slate-900">
                Company Publishing
              </h1>

              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                PUBLISH
              </span>

            </div>

            <p className="text-xs text-slate-500 mt-0.5">
              Configure company inputs, outputs and market indicators
            </p>
          </div>

        </div>

      <div className="flex items-center gap-2">

  <button
    type="button"
    onClick={clearForm}
    disabled={publishing}
    className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium transition disabled:opacity-50"
  >
    Clear
  </button>

  <button
    type="button"
    onClick={handlePublish}
    disabled={publishing}
    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-lg text-xs font-medium transition disabled:opacity-50 flex items-center gap-2"
  >
    {publishing ? (
      <>
        <i className="bi bi-arrow-repeat animate-spin" />
        Publishing...
      </>
    ) : (
      <>
        <i className="bi bi-cloud-upload" />
        Publish Company
      </>
    )}
  </button>

  {success && (
    <span
      className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600"
      title="Company published successfully"
    >
      <i className="bi bi-check-lg text-sm" />
    </span>
  )}

  {error && (
    <span
      className="flex items-center justify-center w-7 h-7 rounded-full bg-red-50 border border-red-200 text-red-600"
      title={error}
    >
      <i className="bi bi-exclamation-lg text-sm" />
    </span>
  )}

</div>

      </div>


      {/* COMPANY CONFIGURATION */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">

        <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">

          <span>
            1 · Company Configuration
          </span>

          <span className="font-mono text-[10px] text-slate-300 font-normal">
            REQUIRED
          </span>

        </div>

        <div className="divide-y divide-slate-100">

          {/* COMPANY NAME */}
          <div className="grid grid-cols-1 md:grid-cols-3">

            <div className="px-4 py-3 bg-[#f8f9fa] border-r border-slate-100">
              <div className="text-[11px] font-semibold text-slate-700">
                Company Name
              </div>

              <div className="text-[9px] text-slate-400 mt-1">
                Registered company name
              </div>
            </div>

            <div className="p-3 md:col-span-2">
              <input
                type="text"
                value={companyName}
                onChange={(e) =>
                  setCompanyName(e.target.value)
                }
                placeholder="e.g. Reliance Industries Limited"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

          </div>


          {/* SYMBOL */}
          <div className="grid grid-cols-1 md:grid-cols-3">

            <div className="px-4 py-3 bg-[#f8f9fa] border-r border-slate-100">
              <div className="text-[11px] font-semibold text-slate-700">
                Trading Symbol
              </div>

              <div className="text-[9px] text-slate-400 mt-1">
                Exchange/company symbol
              </div>
            </div>

            <div className="p-3 md:col-span-2">

              <input
                type="text"
                value={symbol}
                onChange={(e) =>
                  setSymbol(
                    e.target.value.toUpperCase()
                  )
                }
                placeholder="e.g. RELIANCE"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono text-[11px] font-semibold text-slate-900 uppercase focus:outline-none focus:ring-1 focus:ring-slate-400"
              />

            </div>

          </div>

        </div>

      </div>


      {/* INDICATORS */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">

        <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">

          <span>
            2 · Company Intelligence Mapping
          </span>

          <span className="font-mono text-[10px] text-slate-300 font-normal">
            {rawMaterials.length +
              outputProducts.length +
              leadingIndicators.length +
              laggingIndicators.length}{' '}
            ITEMS
          </span>

        </div>


        {renderTagSection({
          label: 'Raw Materials',
          description:
            'Key inputs / commodities required by the company.',
          input: rawMaterialInput,
          setInput: setRawMaterialInput,
          items: rawMaterials,
          setItems: setRawMaterials,
          placeholder: 'e.g. crude_oil',
        })}


        {renderTagSection({
          label: 'Output Products',
          description:
            'Primary products or outputs generated by the company.',
          input: outputProductInput,
          setInput: setOutputProductInput,
          items: outputProducts,
          setItems: setOutputProducts,
          placeholder: 'e.g. petrochemicals',
        })}


        {renderTagSection({
          label: 'Leading Indicators',
          description:
            'External indicators that may provide forward-looking signals.',
          input: leadingIndicatorInput,
          setInput: setLeadingIndicatorInput,
          items: leadingIndicators,
          setItems: setLeadingIndicators,
          placeholder: 'e.g. brent_crude_futures',
        })}


        {renderTagSection({
          label: 'Lagging Indicators',
          description:
            'Company or market indicators reflecting historical performance.',
          input: laggingIndicatorInput,
          setInput: setLaggingIndicatorInput,
          items: laggingIndicators,
          setItems: setLaggingIndicators,
          placeholder: 'e.g. quarterly_gross_refining_margin',
        })}

      </div>



     

    </div>
  );
}