// routes/resqai.js
const express = require('express');
const router = express.Router();
const {
  getIncidents,
  getResources,
  getEvents,
  createIncident,
  dispatchUnit,
  recallUnit
} = require('../controllers/resqaiController');

router.get('/incidents', getIncidents);
router.get('/resources', getResources);
router.get('/events', getEvents);
router.post('/incidents', createIncident);
router.post('/incidents/:incidentId/dispatch/:resourceId', dispatchUnit);
router.post('/incidents/:incidentId/recall/:resourceId', recallUnit);

module.exports = router;