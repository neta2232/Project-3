import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { fetchVacationFollowers } from '../../Api/ClientApi';
import './VacationsReport.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VacationsReport = () => {
  const [labels, setLabels] = useState<{ destination: string; followers: number }[]>([]);

  useEffect(() => {
    fetchVacationFollowers().then((res) => {
      const data = res.data.map((item: any) => ({
        destination: item.destination,
        followers: Number(item.followers_count)
      }));
      setLabels(data);
    });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Vacations followers' },
    },
  };

  const chartData = {
    labels: labels.map(l => l.destination),
    datasets: [
      {
        label: "Followers",
        data: labels.map(l => l.followers),
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      }
    ]
  };

  const downloadCSV = () => {
    const header = "Destination,Followers\n";
    const rows = labels.map(l => `"${l.destination}",${l.followers}`).join("\n");
    const csvContent = header + rows;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "vacations_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <button id='export-btn' onClick={downloadCSV}>Export to Excel</button>
      <h2>Vacations Report</h2>
      <div className='graph'>
        <Bar className='bar' options={options} data={chartData} />
      </div>

    </>
  )
}

export default VacationsReport;

