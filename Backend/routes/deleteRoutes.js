const express = require('express');
const router = express.Router();

const {
  deleteForm1,
  deleteForm2,
  deleteForm3,
  deleteForm4,
  deleteWingCoordinator
} = require('../controllers/deleteFormController');

// DELETE endpoints
router.delete('/form1/:id', deleteForm1);
router.delete('/form2/:id', deleteForm2);
router.delete('/form3/:id', deleteForm3);
router.delete('/form4/:id', deleteForm4);
router.delete('/wing-coordinator/:id', deleteWingCoordinator);

module.exports = router;
