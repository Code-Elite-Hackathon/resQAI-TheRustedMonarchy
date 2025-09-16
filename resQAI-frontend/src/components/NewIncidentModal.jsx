
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const LocationPicker = ({ onLocationSelect }) => {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng);
        },
    });
    return null;
};

// Custom icon for the new incident picker
const newIncidentIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png', // A simple map pin icon
    iconSize: [30, 30],
    iconAnchor: [15, 30],
});

export default function NewIncidentModal({ onClose, onCreateIncident }) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('HIGH');
    const [location, setLocation] = useState(null);
    const [locationName, setLocationName] = useState('');

    const handleSubmit = () => {
        if (title && priority && location) {
            onCreateIncident({
                title,
                priority,
                position: [location.lat, location.lng],
                location: locationName || `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`,
            });
            onClose();
        } else {
            alert('Please fill all fields and select a location on the map.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[1001] flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm md:max-w-2xl text-black shadow-2xl">
                <h2 className="text-2xl font-bold mb-4">Create New Incident</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location Name</label>
                            <input
                                type="text"
                                value={locationName}
                                onChange={(e) => setLocationName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black"
                                placeholder="e.g., Old Market Square"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black"
                            >
                                <option>HIGH</option>
                                <option>CRITICAL</option>
                            </select>
                        </div>
                    </div>
                    <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
                        <MapContainer center={[30.71510, 76.75591]} zoom={12} style={{ height: '100%' }}>
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                            <LocationPicker onLocationSelect={setLocation} />
                            {location && <Marker position={location} icon={newIncidentIcon} />}
                        </MapContainer>
                        <p className="text-xs text-center text-gray-600 mt-1">Click on the map to set incident location</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300 transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="py-2 px-4 bg-black text-white rounded hover:bg-gray-800 transition-colors">Create Incident</button>
                </div>
            </div>
        </div>
    );
}