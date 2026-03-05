import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RiskChart({ metrics }) {
  // A dummy sample chart visualizing event frequency by category
  // In a real app this would use historical data from API
  const data = {
    labels: ['Speeding', 'Harsh Braking', 'Drowsiness'],
    datasets: [
      {
        label: 'Anomalies Today',
        data: [12, 5, 2], // Dummy initial data. Would update via state in real scale.
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(59, 130, 246, 0.7)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#9ca3af' } },
      title: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#374151' },
        ticks: { color: '#9ca3af' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' }
      }
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl flex flex-col h-[300px]">
      <h3 className="font-semibold text-lg text-white mb-4">Event Frequency</h3>
      <div className="flex-1 relative">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
