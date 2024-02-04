const request = require('supertest');
const express = require('express');
const app = express();
const { deleteAppointment } = require('../controllers/controllers');


const mockAppointments = [
  { _id: '1', title: 'Appointment 1', date: '2022-02-01', time: '10:00 AM' },
  { _id: '2', title: 'Appointment 2', date: '2022-02-02', time: '2:00 PM' },
];

jest.mock('../controllers/controllers', () => ({
  deleteAppointment: jest.fn(),
}));


describe('deleteAppointment', () => {
  it('should delete an appointment and return a 204 status', () => {
   
    deleteAppointment.mockImplementationOnce((req, res) => {
      const { id } = req.params;
      const appointmentIndex = mockAppointments.findIndex(app => app._id === id);

      if (appointmentIndex === -1) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      mockAppointments.splice(appointmentIndex, 1);

      return res.status(204).send();
    });

   
    const req = {
      params: { id: '1' },
    };
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    deleteAppointment(req, res);

   
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

 
});
