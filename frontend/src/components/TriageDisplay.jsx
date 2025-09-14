import React from 'react';

const TriageDisplay = ({ triageData, patientId }) => {
  const getUrgencyColor = (level) => {
    const colors = {
      'critical': 'text-red-800 bg-red-100 border-red-300',
      'high': 'text-red-700 bg-red-50 border-red-200',
      'moderate': 'text-yellow-700 bg-yellow-50 border-yellow-200',
      'low': 'text-green-700 bg-green-50 border-green-200',
      'minimal': 'text-gray-700 bg-gray-50 border-gray-200'
    };
    return colors[level] || colors['moderate'];
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-red-600';
    if (score >= 6) return 'text-red-500';
    if (score >= 4) return 'text-yellow-600';
    if (score >= 2) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-4">
      {/* Current Triage Status */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Triage Assessment</h3>
        
        {triageData ? (
          <div className="space-y-3">
            {/* Urgency Score */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Urgency Score:</span>
              <span className={`text-lg font-bold ${getScoreColor(triageData.urgency_score)}`}>
                {triageData.urgency_score}/10
              </span>
            </div>

            {/* Urgency Level */}
            <div className={`px-3 py-2 rounded-lg border text-center ${getUrgencyColor(triageData.urgency_level)}`}>
              <div className="font-semibold capitalize">{triageData.urgency_level}</div>
              <div className="text-xs mt-1">Priority Level</div>
            </div>

            {/* Recommended Action */}
            <div className="border-t pt-3">
              <h4 className="font-medium text-gray-700 mb-2">Recommended Action:</h4>
              <p className="text-sm text-gray-600">{triageData.recommended_action}</p>
            </div>

            {/* Reasoning */}
            {triageData.reasoning && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-gray-700 mb-2">Assessment Reasoning:</h4>
                <p className="text-sm text-gray-600">{triageData.reasoning}</p>
              </div>
            )}

            {/* Escalation Alert */}
            {triageData.escalation?.required && (
              <div className="border-t pt-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <span className="text-red-600">⚠️</span>
                    <span className="font-medium text-red-800 ml-2">Escalation Required</span>
                  </div>
                  <div className="text-sm text-red-700 mt-1">
                    Level: {triageData.escalation.level}
                  </div>
                  {triageData.escalation.instructions && (
                    <ul className="text-sm text-red-600 mt-2 space-y-1">
                      {triageData.escalation.instructions.slice(0, 3).map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-sm">Start a conversation to see triage assessment</div>
          </div>
        )}
      </div>

      {/* Patient Information */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Session Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Patient ID:</span>
            <span className="font-mono text-gray-800">{patientId}</span>
          </div>
          {triageData?.timestamp && (
            <div className="flex justify-between">
              <span className="text-gray-600">Last Assessment:</span>
              <span className="text-gray-800">
                {new Date(triageData.timestamp).toLocaleTimeString()}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Session Status:</span>
            <span className="text-green-600 font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border transition">
            View Patient History
          </button>
          <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border transition">
            Search Medical Knowledge
          </button>
          <button className="w-full text-left px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded border border-red-200 transition">
            Emergency Escalation
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="text-xs text-gray-600 text-center">
          <div>Healthcare AI Pod v1.0</div>
          <div className="mt-1">Powered by Gemini AI + ChromaDB</div>
        </div>
      </div>
    </div>
  );
};

export default TriageDisplay;