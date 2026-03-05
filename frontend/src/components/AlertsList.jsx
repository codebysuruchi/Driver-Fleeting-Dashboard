import React from 'react';
import { AlertTriangle, Activity, Bell } from 'lucide-react';

export default function AlertsList({ alerts }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full">
      <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-800 bg-opacity-50">
        <h3 className="font-semibold text-lg flex items-center">
          <Bell className="w-5 h-5 mr-2 text-yellow-500" />
          Live Intelligence Feed
        </h3>
        <span className="bg-red-500 bg-opacity-20 text-red-500 text-xs px-2 py-1 rounded-full animate-pulse flex items-center">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div> Live
        </span>
      </div>
      <div className="p-4 flex-1 overflow-y-auto max-h-[400px] space-y-3">
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-center  mt-10">Listening for anomalies...</p>
        ) : (
          alerts.map((alert, i) => (
            <div 
              key={i} 
              className={`p-4 rounded-xl border-l-4 shadow-sm transform transition-all duration-300 animate-slide-in ${
                alert.level === 'critical' 
                  ? 'border-red-500 bg-red-500 bg-opacity-10' 
                  : 'border-yellow-500 bg-yellow-500 bg-opacity-10'
              }`}
            >
              <div className="flex items-start">
                {alert.level === 'critical' ? (
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                ) : (
                  <Activity className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                )}
                <div>
                  <p className={`font-medium ${alert.level === 'critical' ? 'text-red-200' : 'text-yellow-200'}`}>
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(alert.timestamp || Date.now()).toLocaleTimeString()} 
                    {alert.driver_id && ` • Driver ID: ${alert.driver_id}`}
                    {alert.trip_id && ` • Trip ID: ${alert.trip_id}`}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
