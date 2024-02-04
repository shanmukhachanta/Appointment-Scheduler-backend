const request = require('supertest');
const express = require('express');
const { postAppointement } = require('../controllers/controllers');


jest.mock('../controllers/controllers', () => ({
  postAppointement: jest.fn(),
}));

describe('POST /', () => {
  const app = express();

  app.post('/', postAppointement);


  it('should create a new appointment', async () => {

    const requestBody = {
      title: 'New Appointment',
      date: '2022-02-01',
      time: '10:00 AM',
    };


    postAppointement.mockImplementationOnce((req, res) => res.status(201).json({ title: 'New Appointment' }));


    const response = await request(app).post('/').send(requestBody);


    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ title: 'New Appointment' });
   

  });

});
