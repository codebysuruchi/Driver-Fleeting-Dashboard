import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { ShieldAlert, Car, Route, ActivitySquare } from 'lucide-react';
import MetricCard from './components/MetricCard';
import AlertsList from './components/AlertsList';
import VideoFeed from './components/VideoFeed';
import RiskChart from './components/RiskChart';

// Connect to backend websocket
const socket = io('http://localhost:5000');

function App() {
  const [metrics, setMetrics] = useState({
    totalTrips: 0,
    liveDrivers: 0,
    violationCount: 0,
    avgRiskScore: 0
  });
  
  const [alerts, setAlerts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  const fetchMetrics = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/metrics');
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      setConnectionStatus('connected');
      fetchMetrics();
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('new_event', (event) => {
      // Update violation metric if not normal
      if (event.type !== 'normal') {
        setMetrics(prev => ({
          ...prev,
          violationCount: prev.violationCount + 1
        }));
      }
    });

    socket.on('alert', (alertData) => {
      setAlerts(prev => [alertData, ...prev].slice(0, 50)); // keep last 50
    });

    socket.on('metrics_update', () => {
      fetchMetrics();
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new_event');
      socket.off('alert');
      socket.off('metrics_update');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">okDriver <span className="text-blue-500">Fleet AI</span></h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800">
            <div className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-gray-300 capitalize">{connectionStatus}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden border-2 border-gray-700">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Metrics + Video) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="Active Fleet" 
              value={metrics.liveDrivers} 
              icon={Car} 
              colorClass="bg-blue-500" 
            />
            <MetricCard 
              title="Active Trips" 
              value={metrics.totalTrips} 
              icon={Route} 
              colorClass="bg-emerald-500" 
            />
            <MetricCard 
              title="Avg Risk Score" 
              value={metrics.avgRiskScore} 
              icon={ActivitySquare} 
              colorClass={metrics.avgRiskScore > 15 ? 'bg-orange-500' : 'bg-green-500'} 
            />
            <MetricCard 
              title="Anomalies" 
              value={metrics.violationCount} 
              icon={ShieldAlert} 
              colorClass="bg-red-500" 
            />
          </div>

          {/* Video Feed */}
          <VideoFeed />
        </div>

        {/* Right Column (Live Feed + Chart) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          {/* Alerts Feed */}
          <div className="flex-1 min-h-[400px]">
            <AlertsList alerts={alerts} />
          </div>
          
          {/* Risk Chart */}
          <RiskChart metrics={metrics} />
        </div>

      </div>
    </div>
  );
}

export default App;
