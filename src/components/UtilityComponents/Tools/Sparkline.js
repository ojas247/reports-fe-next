import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Optional: Boost performance plugin for large datasets
// if (typeof Highcharts === "object") {
//   require("highcharts/modules/boost")(Highcharts);
// }

export default function Sparkline({ data, up }) {
  const options = {
    chart: {
      type: "line",
      backgroundColor: "transparent",
      height: 40,
      margin: [2, 0, 2, 0],
    },
    title: { text: null },
    xAxis: { visible: false },
    yAxis: { visible: false },
    tooltip: { enabled: false },
    legend: { enabled: false },
    credits: { enabled: false },
    plotOptions: {
      series: {
        lineWidth: 1.5,
        marker: { enabled: false },
        color: up ? "#16a34a" : "#dc2626", // green or red
      },
    },
    series: [{ data }],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
