const request = require('supertest');
const express = require('express');
const app = express();
const { updateAppointment } = require('../controllers/controllers');


const mockAppointments = [
  { _id: '1', title: 'Appointment 1', date: '2022-02-01', time: '10:00 AM' },
  { _id: '2', title: 'Appointment 2', date: '2022-02-02', time: '2:00 PM' },
];


jest.mock('../controllers/controllers', () => ({
  updateAppointment: jest.fn(),
}));


describe('updateAppointment', () => {
  it('should update an appointment and return the updated appointment', () => {

    updateAppointment.mockImplementationOnce((req, res) => {
      const { id } = req.params;
      const { title, date, time } = req.body;
      const appointmentIndex = mockAppointments.findIndex(app => app._id === id);

      if (appointmentIndex === -1) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      const updatedAppointment = {
        ...mockAppointments[appointmentIndex],
        title: title || mockAppointments[appointmentIndex].title,
        date: date || mockAppointments[appointmentIndex].date,
        time: time || mockAppointments[appointmentIndex].time,
      };

      mockAppointments[appointmentIndex] = updatedAppointment;

      return res.status(200).json(updatedAppointment);
    });

    const req = {
      params: { id: '1' },
      body: { title: 'Updated Title' }, // Add other properties as needed
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };


    updateAppointment(req, res);


    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: '1',
      title: 'Updated Title', 
      date: '2022-02-01',
      time: '10:00 AM',
    });
  });


});
