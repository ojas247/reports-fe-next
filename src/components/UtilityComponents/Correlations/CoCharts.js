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
  

  const series1 = apiData.map((item) => {
    const unitIndex = uniqueUnits.indexOf(item.units);
    return {
      name: item.item,
      data: item.x.map((_, idx) => [
        new Date(item.x[idx]).getTime(),
        item.y[idx],
      ]),
      yAxis: unitIndex,
      color: colors[unitIndex % colors.length],
      showInLegend: true,
      visible: true,
      type: chartType,
    };
  });

  const options = {
    chart: {
      type: chartType,
    },
    title: { text: null },
    credits: { enabled: false },
    xAxis: {
      type: "datetime",
      labels: {
        format: "{value:%Y}",
      },
    },
    yAxis: yAxis,
    tooltip: {
      shared: true,
      xDateFormat: "%Y-%m-%d",
    },
    plotOptions: {
      series: {
        stacking: isStacked ? "normal" : undefined,
      },
    },
    legend: {
      enabled: true,
    },
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
