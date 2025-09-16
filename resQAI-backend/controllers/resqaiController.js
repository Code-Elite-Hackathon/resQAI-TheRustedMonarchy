
const Incident = require('../models/incident');
const Resource = require('../models/resource');
const Event = require('../models/event');


const formatIncidents = (incidents) => {
  return incidents.reduce((acc, incident) => {
    acc[incident.id] = incident;
    return acc;
  }, {});
};


exports.getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find({});
    res.json(formatIncidents(incidents));
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find({});
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.getEvents = async (req, res) => {
  try {

    const events = await Event.find({}).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};



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



exports.dispatchUnit = async (req, res) => {
  try {
    const { incidentId, resourceId } = req.params;
    const incident = await Incident.findOne({ id: incidentId });
    const resource = await Resource.findOne({ id: resourceId });

    if (!incident || !resource) {
      return res.status(404).json({ message: 'Incident or Resource not found' });
    }


    resource.status = 'En Route';
    resource.location = incidentId;
    await resource.save();


    incident.assignedUnits.push(resourceId);
    incident.log.push(`${new Date().toLocaleTimeString('en-GB')} - ${resourceId} dispatched`);
    await incident.save();


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


exports.recallUnit = async (req, res) => {
  try {
    const { incidentId, resourceId } = req.params;
    const incident = await Incident.findOne({ id: incidentId });
    const resource = await Resource.findOne({ id: resourceId });

    if (!incident || !resource) {
      return res.status(404).json({ message: 'Incident or Resource not found' });
    }
    

    resource.status = 'Available';
    resource.location = 'Station'; 
    await resource.save();


    incident.assignedUnits = incident.assignedUnits.filter(unit => unit !== resourceId);
    incident.log.push(`${new Date().toLocaleTimeString('en-GB')} - ${resourceId} recalled`);
    await incident.save();
    

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