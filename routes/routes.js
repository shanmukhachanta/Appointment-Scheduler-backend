const express = require('express');

const { getAllAppointment, postAppointment, getSingleAppointment, deleteappointment, updateAppointment } = require('../controllers/controllers');

const router = express.Router();

router.get('/', getAllAppointment);
router.post('/', postAppointment);
router.get('/:id', getSingleAppointment); // Fix the function name here
router.delete('/:id', deleteappointment);
router.patch('/:id', updateAppointment);

module.exports = router;
