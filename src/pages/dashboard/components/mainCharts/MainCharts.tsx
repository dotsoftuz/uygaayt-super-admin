import React from "react";
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from "chart.js";
import { PolarArea } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);



const PolarAreaChart = ({data, all_orders}:any) => {
  const { t } = useTranslation();
  
  const data2 = {
    labels: [t('dashboard.completed_orders'), t('dashboard.cancelled_orders'), t('dashboard.total_orders')],
    datasets: [
      {
        label: "Buyurtmalar",
        data: [data?.[0].total_amount, data?.[1].total_amount, all_orders],
        backgroundColor: [
          "rgba(0, 128, 0, 0.6)",
          "rgba(255, 0, 0, 0.6)",
          "rgba(0, 0, 255, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "500px", height: "500px", margin: "0 auto" }}>
      <PolarArea data={data2} />
    </div>
  );
};

export default PolarAreaChart;