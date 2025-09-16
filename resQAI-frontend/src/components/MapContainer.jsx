// src/components/MapContainer.jsx
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, Tooltip, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// New set of resource icons
const resourceIcons = {
    'Hazmat': new L.Icon({ iconUrl: 'https://img.icons8.com/ios-filled/50/FF0000/biohazard.png', iconSize: [30, 30] }),
    'Helicopter': new L.Icon({ iconUrl: 'https://img.icons8.com/ios-filled/50/0000FF/helicopter.png', iconSize: [30, 30] }),
    'K9 Unit': new L.Icon({ iconUrl: 'https://img.icons8.com/ios-filled/50/008000/police-dog.png', iconSize: [30, 30] }),
    Default: new L.Icon({ iconUrl: 'https://img.icons8.com/ios-filled/50/000000/vehicle.png', iconSize: [25, 25] })
};

// Function to generate a random location near an incident
const generateNearbyPosition = (incidentPosition) => {
    const [lat, lng] = incidentPosition;
    const radius = 0.01; // Approx 1km
    const randomLat = lat + (Math.random() - 0.5) * radius * 2;
    const randomLng = lng + (Math.random() - 0.5) * radius * 2;
    return [randomLat, randomLng];
};


export default function MapContainer({ incidents, resources, selectedIncidentId, onSelectIncident }) {
  const mapRef = useRef(null);
  const incidentMarkerRefs = useRef({});
  const [resourcePaths, setResourcePaths] = useState({});
  const [newUnits, setNewUnits] = useState([]);

  const incidentIcon = (priority) => new L.DivIcon({
    className: `incident-blip-marker ${priority === 'CRITICAL' ? 'critical' : ''}`,
    iconSize: [16, 16],
  });

  useEffect(() => {
    if (selectedIncidentId && incidentMarkerRefs.current[selectedIncidentId] && mapRef.current) {
      const marker = incidentMarkerRefs.current[selectedIncidentId];
      mapRef.current.flyTo(marker.getLatLng(), 14, {
          animate: true,
          duration: 1.5
      });
      marker.openPopup();
    }
  }, [selectedIncidentId]);

  useEffect(() => {
    if (Array.isArray(resources)) {
      const newPaths = { ...resourcePaths };
      resources.forEach(resource => {
        if (resource.status === 'En Route' || resource.status === 'On Scene') {
          const path = newPaths[resource.id] || [];
          const lastPosition = path[path.length - 1];
          if (!lastPosition || lastPosition[0] !== resource.position[0] || lastPosition[1] !== resource.position[1]) {
            newPaths[resource.id] = [...path, resource.position];
          }
        } else {
            if (newPaths[resource.id]) {
                delete newPaths[resource.id];
            }
        }
      });
      setResourcePaths(newPaths);
    }
  }, [resources]);

  useEffect(() => {
    // When incidents change, generate new units near them
    const activeIncidents = Object.values(incidents);
    if (activeIncidents.length > 0) {
        const generatedUnits = [
            { id: 'HAZ01', type: 'Hazmat', position: generateNearbyPosition(activeIncidents[0].position), status: 'Available' },
            { id: 'AIR01', type: 'Helicopter', position: generateNearbyPosition(activeIncidents[0].position), status: 'Available' },
            { id: 'K9-01', type: 'K9 Unit', position: generateNearbyPosition(activeIncidents[0].position), status: 'Available' }
        ];
        if (activeIncidents.length > 1) {
            generatedUnits.push({ id: 'HAZ02', type: 'Hazmat', position: generateNearbyPosition(activeIncidents[1].position), status: 'Available' });
        }
        setNewUnits(generatedUnits);
    }
  }, [incidents]);


  return (
    <div className="h-full w-full">
      <LeafletMap
        center={[30.71510, 76.75591]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {Object.values(incidents).map((incident) => (
          <Marker
            key={incident.id}
            position={incident.position}
            icon={incidentIcon(incident.priority)}
            ref={(el) => (incidentMarkerRefs.current[incident.id] = el)}
            eventHandlers={{ click: () => onSelectIncident(incident.id) }}
            zIndexOffset={1000}
          >
            <Tooltip permanent direction="top" offset={[0, -8]} opacity={0.9} className="font-sans !bg-white !text-black !border-gray-300">
              {incident.id}
            </Tooltip>
            <Popup>
              <div className="text-black">
                <h3 className="font-bold text-base m-0">{incident.title}</h3>
                <p className="text-sm m-0">{incident.id}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* --- REMOVED PREVIOUS UNITS --- */}
        {/* The old resource mapping is removed. */}

        {/* --- ADDED NEW UNITS --- */}
        {newUnits.map((unit) => (
             <Marker
                key={unit.id}
                position={unit.position}
                icon={resourceIcons[unit.type] || resourceIcons.Default}
            >
                <Tooltip direction="bottom" offset={[0, 10]} opacity={0.8}>
                    <span className="font-bold">{unit.id}</span> - {unit.status}
                </Tooltip>
            </Marker>
        ))}

        {Object.entries(resourcePaths).map(([resourceId, path]) => (
            <Polyline key={resourceId} positions={path} color="blue" weight={3} opacity={0.7} />
        ))}
      </LeafletMap>
    </div>
  );
}