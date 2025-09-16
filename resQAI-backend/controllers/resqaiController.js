// controllers/resqaiController.js
const Incident = require('../models/incident');
const Resource = require('../models/resource');
const Event = require('../models/event');

// Helper to format incidents into the key-value pair object the frontend expects
const formatIncidents = (incidents) => {
  return incidents.reduce((acc, incident) => {
    acc[incident.id] = incident;
    return acc;
  }, {});
};

// @desc    Get all incidents
// @route   GET /api/incidents
exports.getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find({});
    res.json(formatIncidents(incidents));
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all resources
// @route   GET /api/resources
exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find({});
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all events
// @route   GET /api/events
exports.getEvents = async (req, res) => {
  try {
    // Sort by timestamp descending to get the latest events first
    const events = await Event.find({}).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new incident
// @route   POST /api/incidents
exports.createIncident = async (req, res) => {
  try {
    const { title, location, position, priority, aiRecommendation } = req.body;
    const newIncident = new Incident({
      id: `INC-${Date.now()}`,
      title,
      location,
      position,
      priority,
      aiRecommendation,
      log: [`${new Date().toLocaleTimeString('en-GB')} - Incident created`],
    });
    await newIncident.save();
    
    // Create a corresponding event
    const newEvent = new Event({
        id: `evt-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-GB'),
        text: `New incident created: ${title}`,
        type: 'critical',
        incidentId: newIncident.id,
    });
    await newEvent.save();

    res.status(201).json({ newIncident, newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating incident' });
  }
};

// @desc    Dispatch a unit to an incident
// @route   POST /api/incidents/:incidentId/dispatch/:resourceId
exports.dispatchUnit = async (req, res) => {
  try {
    const { incidentId, resourceId } = req.params;
    const incident = await Incident.findOne({ id: incidentId });
    const resource = await Resource.findOne({ id: resourceId });

    if (!incident || !resource) {
      return res.status(404).json({ message: 'Incident or Resource not found' });
    }

    // Update resource
    resource.status = 'En Route';
    resource.location = incidentId;
    await resource.save();

    // Update incident
    incident.assignedUnits.push(resourceId);
    incident.log.push(`${new Date().toLocaleTimeString('en-GB')} - ${resourceId} dispatched`);
    await incident.save();

    // Create event
    const newEvent = new Event({
        id: `evt-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-GB'),
        text: `${resourceId} dispatched to ${incidentId}.`,
        type: 'dispatch',
        incidentId,
    });
    await newEvent.save();

    res.status(200).json({ message: 'Unit dispatched successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Recall a unit from an incident
// @route   POST /api/incidents/:incidentId/recall/:resourceId
exports.recallUnit = async (req, res) => {
  try {
    const { incidentId, resourceId } = req.params;
    const incident = await Incident.findOne({ id: incidentId });
    const resource = await Resource.findOne({ id: resourceId });

    if (!incident || !resource) {
      return res.status(404).json({ message: 'Incident or Resource not found' });
    }
    
    // Update resource
    resource.status = 'Available';
    resource.location = 'Station'; // Or some other base location
    await resource.save();

    // Update incident
    incident.assignedUnits = incident.assignedUnits.filter(unit => unit !== resourceId);
    incident.log.push(`${new Date().toLocaleTimeString('en-GB')} - ${resourceId} recalled`);
    await incident.save();
    
    // Create event
    const newEvent = new Event({
        id: `evt-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-GB'),
        text: `${resourceId} recalled from ${incidentId}. Now available.`,
        type: 'info',
        incidentId,
    });
    await newEvent.save();

    res.status(200).json({ message: 'Unit recalled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};