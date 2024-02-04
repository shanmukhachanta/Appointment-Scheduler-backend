const request = require('supertest');
const express = require('express');
const app = express();
const { getAllAppointment } = require('../controllers/controllers');

// Mock the controller function
jest.mock('../controllers/controllers', () => ({
  getAllAppointment: jest.fn(),
}));

// Attach the route to the app
app.get('/', getAllAppointment);

// Test case for the GET / route
it('GET / should return a list of appointments', async () => {
  // Mock data you expect to be returned by getAllAppointment
  const mockAppointments = [
    { _id: '1', title: 'Appointment 1', date: '2022-02-01', time: '10:00 AM' },
    { _id: '2', title: 'Appointment 2', date: '2022-02-02', time: '2:00 PM' },
  ];

  // Mock the implementation of getAllAppointment
  getAllAppointment.mockImplementationOnce((req, res) => res.status(200).json(mockAppointments));

  // Perform the GET request
  const response = await request(app).get('/');

  // Assertions
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(mockAppointments);
  expect(getAllAppointment).toHaveBeenCalled();
});



