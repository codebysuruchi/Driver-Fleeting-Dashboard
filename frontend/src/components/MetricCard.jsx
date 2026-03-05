import React from 'react';

export default function MetricCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className={`p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-xl flex items-center space-x-4 transform transition-all hover:scale-105`}>
      <div className={`p-4 rounded-full ${colorClass} bg-opacity-20`}>
        <Icon className={`w-8 h-8 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}
