const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createForm, getObserverDashboard, getuserForm, getSingleuserForm, FormFill, GetObseverForm1 } = require('../controllers/FormOneController');

// 1. Route to create a new form by Teacher or Coordinator
router.post('/fortnightly-monitor/create', authMiddleware, createForm);

// 2. Route to get forms for Mother Teachers to fill
// router.get('/fortnightly-monitor/mother-teacher/:teacherID',authMiddleware, getFormsForMotherTeacher);

// 3. Route to get forms for Observers to fill
// router.get('/fortnightly-monitor/observer/:observerID',authMiddleware, getFormsForObserver);

// 4. Route to fill and submit the form (by Teacher or Observer)
// router.post('/fortnightly-monitor/submit',authMiddleware, fillForm);

// 5. Route to get forms displayed on Observer's Dashboard
router.post('/fortnightly-monitor/observer-dashboard',authMiddleware, getObserverDashboard);
router.get('/fortnightly-monitor',authMiddleware, getuserForm);
router.get('/fortnightly-monitor/oberver/get',authMiddleware, GetObseverForm1);
router.get('/fortnightly-monitor/:id',authMiddleware, getSingleuserForm);
router.put('/fortnightly-monitor/:id',authMiddleware, FormFill);

module.exports = router;