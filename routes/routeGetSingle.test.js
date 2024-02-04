

const request = require('supertest');
const express = require('express');
const app = express();
const { getSingleAppointment } = require('../controllers/controllers');


const mockAppointments = [
  { _id: '1', title: 'Appointment 1', date: '2022-02-01', time: '10:00 AM' },
  { _id: '2', title: 'Appointment 2', date: '2022-02-02', time: '2:00 PM' },
];


jest.mock('../controllers/controllers', () => ({
  getSingleAppointment: jest.fn(),
}));


describe('getSingleAppointment', () => {
  it('should return a single appointment', () => {

    getSingleAppointment.mockImplementationOnce((req, res) => {
      const { id } = req.params;
      const appointment = mockAppointments.find(app => app._id === id);

      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      return res.status(200).json(appointment);
    });


    const req = { params: { id: '1' } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

 
    getSingleAppointment(req, res);

  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAppointments[0]);
  });


});
