import React from 'react';

export default function VideoFeed() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl aspect-video relative group">
      <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center border border-gray-700">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse mr-2"></div>
        <span className="text-xs font-medium tracking-wider text-gray-200 uppercase">Live Dashcam</span>
      </div>
      <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-60 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-700">
        <span className="text-xs font-mono text-gray-300">TRIP-A829 • OKD-042</span>
      </div>
      
      {/* 
        Using a placeholder realistic highway driving video via youtube iframe.
        A real dashcam feed can be sourced similarly using WebRTC or HLS.
      */}
      <iframe 
        className="w-full h-full object-cover"
        src="https://www.youtube.com/embed/8aZkYV_B-1k?autoplay=1&mute=1&loop=1&playlist=8aZkYV_B-1k&controls=0&showinfo=0&rel=0" 
        title="Live Dashcam Feed" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
      ></iframe>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
    </div>
  );
}
