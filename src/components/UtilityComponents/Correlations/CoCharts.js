import { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function CoCharts({ apiData }) {
  const [chartType, setChartType] = useState("line");
  const [isStacked, setIsStacked] = useState(false);

  const uniqueUnits = [...new Set(apiData.map((item) => item.units))];
  const colors = Highcharts.getOptions().colors;

  const yAxis = uniqueUnits.map((unit, index) => ({
    title: {
      text: unit,
      style: { color: colors[index % colors.length] },
    },
    labels: {
     // format: {value}, //${unit}, ////older version
      style: { color: colors[index % colors.length] },
      formatter: function () {
        let value = this.value;
        if (value >= 10000000) {
          return (value / 10000000).toFixed(1) + ' Cr';
        } else if (value >= 100000) {
          return (value / 100000).toFixed(1) + ' Lac';
        } else if (value >= 1000) {
          return (value / 1000).toFixed(1) + ' K';
        }
        return value;
      }
    },
    opposite: index % 2 !== 0,
  }));
  
  // Helper to format labels
  const formatLabel = (dateStr, granularity) => {
  if (!dateStr) return dateStr;

  const parts = dateStr.split("-");
  if (parts.length < 2) return dateStr; // fallback

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
 
  if (granularity === "Monthly") {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[month - 1]}'${String(year).slice(-2)}`;
  }

  if (granularity === "Quarterly") {
    let quarter;
    if (month >= 1 && month <= 3) quarter = 1;
    else if (month >= 4 && month <= 6) quarter = 2;
    else if (month >= 7 && month <= 9) quarter = 3;
    else quarter = 4;
    return `Q${quarter}'${String(year).slice(-2)}`;
  }
  if (granularity === "Yearly") {
    // Financial year ending logic: if month >= Apr, FY ends next year
    const fyYear = month >= 4 ? year + 1 : year;
    return `FY'${String(fyYear).slice(-2)}`;
  }
  if (granularity === "Calendar Year") {
    const cyYear = year;
    return `CY'${String(cyYear).slice(-2)}`;
  }


  // Default fallback
  return dateStr;
};

// Prepare categories
const categories = apiData[0]?.x.map((xValue, idx) => formatLabel(xValue, apiData[0].granularity));

// Prepare series
const series1 = apiData.map((item) => {
  const unitIndex = uniqueUnits.indexOf(item.units);
  return {
    name: item.item,
    data: item.y, // just Y values, X is mapped via categories
    yAxis: unitIndex,
    color: colors[unitIndex % colors.length],
    showInLegend: true,
    visible: true,
    type: chartType,
  };
});

// Chart options
const options = {
  chart: { type: chartType },
  title: { text: null },
  credits: { enabled: false },
  xAxis: {
    categories: categories, // <-- Use preformatted labels
    labels: { style: { fontSize: "12px" } },
  },
  yAxis: yAxis,
  tooltip: {
    shared: true,
    formatter: function () {
      let s = `<b>${this.x}</b>`;
      this.points.forEach((point) => {
        s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: ${point.y}`;
      });
      return s;
    },
  },
  plotOptions: { series: { stacking: isStacked ? "normal" : undefined } },
  legend: { enabled: true },
  series: series1,
};

  return (
    <div className="p-2">
      {/* Toolbar */}
      <div className="flex flex-wrap sm:flex-nowrap justify-end gap-2 mb-3">
        <button
          className={`px-3 py-1 text-sm border border-gray-300 rounded-md transition ${
            chartType === "line"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => setChartType("line")}
        >
         <i className={`bi bi-graph-up mr-1`}></i> Line
        </button>
        <button
          className={`px-3 py-1 text-sm border border-gray-300 rounded-md transition ${
            chartType === "column"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => setChartType("column")}
        >
          <i className={`bi bi-columns-gap mr-1`}></i> Bar
        </button>
        <button
          className={`px-3 py-1 text-sm border border-gray-300 rounded-md transition ${
            isStacked
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => setIsStacked((prev) => !prev)}
        >
          {isStacked ? "🔓 Unstack" : "📦 Stack"}
        </button>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}
