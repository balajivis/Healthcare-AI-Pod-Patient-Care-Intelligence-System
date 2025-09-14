import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import TriageDisplay from './components/TriageDisplay';
import HealthCheck from './components/HealthCheck';
import './App.css';

function App() {
  const [patientId, setPatientId] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [triageData, setTriageData] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);

  useEffect(() => {
    // Check system health on startup
    checkSystemHealth();
  }, []);

  const checkSystemHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setSystemHealth(data);
    } catch (error) {
      console.error('Health check failed:', error);
      setSystemHealth({ status: 'unhealthy', error: error.message });
    }
  };

  const startPatientSession = async () => {
    const newPatientId = `patient_${Date.now()}`;
    
    try {
      const response = await fetch('/api/patient/start-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patient_id: newPatientId }),
      });

      if (response.ok) {
        setPatientId(newPatientId);
        setSessionActive(true);
        setTriageData(null); // Reset triage data for new session
      } else {
        console.error('Failed to start session');
      }
    } catch (error) {
      console.error('Session start error:', error);
    }
  };

  const handleTriageUpdate = (newTriageData) => {
    setTriageData(newTriageData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Healthcare AI Pod</h1>
          <div className="flex items-center space-x-4">
            <HealthCheck health={systemHealth} />
            {sessionActive && (
              <span className="text-sm bg-blue-700 px-2 py-1 rounded">
                Session: {patientId}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {!sessionActive ? (
          <div className="max-w-md mx-auto mt-16 text-center">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold mb-4">Welcome to Healthcare AI</h2>
              <p className="text-gray-600 mb-6">
                Start a new patient session to begin the intelligent triage process.
              </p>
              <button
                onClick={startPatientSession}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                disabled={systemHealth?.status !== 'healthy'}
              >
                Start Patient Session
              </button>
              {systemHealth?.status !== 'healthy' && (
                <p className="text-red-500 text-sm mt-2">
                  System not ready. Please check system health.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface - Main Column */}
            <div className="lg:col-span-2">
              <ChatInterface 
                patientId={patientId}
                onTriageUpdate={handleTriageUpdate}
              />
            </div>

            {/* Triage Display - Side Column */}
            <div className="lg:col-span-1">
              <TriageDisplay 
                triageData={triageData}
                patientId={patientId}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>Healthcare AI Pod - Modern AI Pro Practitioner Course</p>
          <p className="text-gray-400">Built with React + Flask + ChromaDB + Gemini AI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;