
import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import EventFeed from './EventFeed';
import MapContainer from './MapContainer';
import ActionPanel from './ActionPanel';
import NewIncidentModal from './NewIncidentModal';
import { api } from '../services/api';
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * --- UPGRADED: Sends a highly detailed prompt to the Gemini API ---
 * This function now requests a comprehensive, multi-point analysis for each incident.
 * @param {object} incidentData - The details of the new incident.
 * @returns {Promise<string>} A detailed JSON string from the AI.
 */
const getAIRecommendation = async (incidentData) => {
  const { title, priority, location } = incidentData;
  console.log("Requesting ADVANCED AI recommendation from Google Gemini for:", title);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      As an experienced incident commander, provide a detailed operational plan for the following emergency in India.
      The output must be a single, minified JSON object. Each key's value must be an array of strings.

      The JSON structure must be:
      {
        "situationAssessment": ["Provide a brief overview of the likely situation."],
        "immediateActions": ["List at least 2-3 critical first steps for the first unit on scene."],
        "recommendedUnits": ["List the specific types and number of units to dispatch."],
        "potentialHazards": ["List at least 2-3 potential on-scene dangers."],
        "safetyPrecautions": ["List at least 2-3 specific safety protocols for personnel."]
      }

      Do not include any other text, preamble, or markdown formatting.

      Incident Title: "${title}"
      Priority: ${priority}
      Location: "${location}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("AI Response:", text);
    return text; 

  } catch (error) {
    console.error("Error fetching AI recommendation:", error);

    return '{"situationAssessment": ["AI service is currently unavailable."], "immediateActions": ["Follow standard protocols."], "recommendedUnits": ["Dispatch units based on manual assessment."], "potentialHazards": ["Unknown due to service outage."], "safetyPrecautions": ["Maintain heightened situational awareness."]}';
  }
};

export default function Dashboard() {
  const [incidents, setIncidents] = useState({});
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingIncident, setIsCreatingIncident] = useState(false);

  const fetchAllData = useCallback(async () => {
    try {
      const [incidentsData, resourcesData, eventsData] = await Promise.all([
        api.getIncidents(),
        api.getResources(),
        api.getEvents(),
      ]);
      setIncidents(incidentsData);
      setResources(resourcesData);
      setEvents(eventsData);
    } catch (err) {
      setError('Failed to connect to the API. Make sure your backend server is running and CORS is configured.');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAllData().finally(() => setLoading(false));
    const interval = setInterval(fetchAllData, 5000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  const handleCreateIncident = async (incidentData) => {
    setIsCreatingIncident(true);
    try {
      const recommendation = await getAIRecommendation(incidentData);

      const newIncidentPayload = {
        ...incidentData,
        aiRecommendation: recommendation, 
      };

      await api.createIncident(newIncidentPayload);
      await fetchAllData();
    } catch (err) {
      console.error("Failed to create incident:", err);
    } finally {
      setIsModalOpen(false);
      setIsCreatingIncident(false);
    }
  };

  const handleDispatchUnit = async (incidentId, resourceId) => {
    await api.dispatchUnit(incidentId, resourceId);
    await fetchAllData();
  };

  const handleRecallUnit = async (incidentId, resourceId) => {
    await api.recallUnit(incidentId, resourceId);
    await fetchAllData();
  };

  if (loading) return <div className="h-screen flex justify-center items-center font-bold text-lg">Loading Command Center...</div>;
  if (error) return <div className="h-screen flex justify-center items-center text-red-600 font-bold text-center p-4">{error}</div>;

  return (
    <div className="h-screen flex flex-col bg-gray-100 text-gray-800">
      {isModalOpen && <NewIncidentModal
        onClose={() => setIsModalOpen(false)}
        onCreateIncident={handleCreateIncident}
        isCreating={isCreatingIncident}
      />}
      <Header
        resources={resources}
        incidents={incidents}
        onNewIncidentClick={() => setIsModalOpen(true)}
      />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-[350px_1fr_400px] gap-4 p-4">
        <EventFeed events={events} onEventSelect={setSelectedIncidentId} />
        <div className="rounded-lg shadow-md overflow-hidden">
          <MapContainer
            incidents={incidents}
            resources={resources}
            selectedIncidentId={selectedIncidentId}
            onSelectIncident={setSelectedIncidentId}
          />
        </div>
        <ActionPanel
          key={selectedIncidentId}
          selectedIncident={incidents[selectedIncidentId]}
          resources={resources}
          onDispatchUnit={handleDispatchUnit}
          onRecallUnit={handleRecallUnit}
        />
      </main>
    </div>
  );
}