// This file contains mock data to simulate a real-time environment.
export const mockResources = [
    { id: 'AMB-01', type: 'Ambulance', status: 'Available', location: 'Queen\'s Medical Centre' },
    { id: 'AMB-02', type: 'Ambulance', status: 'On Scene', location: 'INC-0834' },
    { id: 'FRU-01', type: 'Fire & Rescue', status: 'En Route', location: 'INC-0835' },
    { id: 'FRU-02', type: 'Fire & Rescue', status: 'Available', location: 'London Road Station' },
    { id: 'POL-01', type: 'Police Unit', status: 'Available', location: 'Byron House' },
    { id: 'POL-02', type: 'Police Unit', status: 'On Scene', location: 'INC-0834' },
];

export const mockIncidents = {
    'inc-0834': {
        id: 'INC-0834',
        title: 'Multi-vehicle collision on ISBT Sec-17, Chandigarh',
        // --- ADD COORDINATES ---

        location: 'ISBT Sec-17, Chandigarh',
        priority: 'CRITICAL',
        status: 'Active',
        position: [30.73885, 76.78484], // [lat, lng]
        reported: '13:20:43',
        assignedUnits: ['AMB-02', 'POL-02'],
        log: ['13:20:43 - Incident reported.', '13:22:10 - Units AMB-02, POL-02 dispatched.'],
        aiRecommendation: 'High-impact collision. Recommend dispatching Fire & Rescue for extraction.',
    },
    'inc-0835': {
        id: 'INC-0835',
        title: 'Structure Fire Reported',
        // --- ADD COORDINATES ---
        position: [30.66892, 76.78669], // Colwick Industrial Estate
        location: 'Shaheed Bhagat Singh International Airport, SAS Nagar',
        priority: 'HIGH',
        status: 'Active',
        
        reported: '13:35:12',
        assignedUnits: ['FRU-01'],
        log: ['13:35:12 - Smoke reported from warehouse.', '13:36:05 - Unit FRU-01 dispatched.'],
        aiRecommendation: 'AI predicts risk of spread to adjacent structures within 30 minutes.',
    },
    'inc-0836': {
        id: 'INC-0836',
        title: 'Water Shortage',
        // --- ADD COORDINATES ---
        position: [30.62638, 76.24918], // Colwick Industrial Estate
        location: 'Shaheed Bhagat Singh International Airport, SAS Nagar',
        priority: 'HIGH',
        status: 'Active',
        
        reported: '13:35:12',
        assignedUnits: ['FRU-01'],
        log: ['13:35:12 - Smoke reported from warehouse.', '13:36:05 - Unit FRU-01 dispatched.'],
        aiRecommendation: 'AI predicts risk of spread to adjacent structures within 30 minutes.',
    },
};
export const mockEvents = [
    { id: 'evt-3', incidentId: 'inc-0836', time: '13:56:43', text: 'New CRITICAL incident: RAndom.', type: 'critical' },
    { id: 'evt-1', incidentId: 'inc-0835', time: '13:35:12', text: 'New HIGH priority incident: Structure Fire Reported.', type: 'critical' },
    { id: 'evt-2', incidentId: 'inc-0834', time: '13:20:43', text: 'New CRITICAL incident: Multi-vehicle collision on A52.', type: 'critical' },
];