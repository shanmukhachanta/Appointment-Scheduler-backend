const {getAllAppointment,postAppointment,getSingleAppointment,deleteappointment,updateAppointment}= require('./controllers');
const Appointment = require('../models/model');
const mongoose = require('mongoose');
jest.mock('../models/model');

describe('CRUD', () => {
  it('should return a list of appointments', async () => {

    const mockAppointments = [
      { _id: '1', title: 'Appointment 1', date: '2024-01-22', time: '12:00' },
      { _id: '2', title: 'Appointment 2', date: '2024-01-23', time: '14:00' },
    ];


    Appointment.find.mockResolvedValue(mockAppointments);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };


    await getAllAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAppointments);
  });
});

describe('postAppointment', () => {
  const req = {
    body: {
      title: 'New appointment',
      date: '2024-01-22',
      time: '12:00',
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {

    jest.clearAllMocks();
  });

  it('should handle a new appointment creation', async () => {

    Appointment.findOne.mockResolvedValue(null);

   
    const mockCreatedAppointment = { _id: 'mockId', title: 'New appointment', date: '2024-01-22', time: '12:00' };
    Appointment.create.mockResolvedValue(mockCreatedAppointment);

    await postAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCreatedAppointment);
  });

  it('should handle an existing appointment', async () => {
   
    const mockExistingAppointment = { _id: 'existingId', title: 'Existing appointment', date: '2024-01-22', time: '12:00' };
    Appointment.findOne.mockResolvedValue(mockExistingAppointment);


    await postAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: 'Slot already booked.' });
  });

  it('should handle an error during appointment creation', async () => {
  
    Appointment.findOne.mockResolvedValue(null);

   
    const errorMessage = 'Some error occurred.';
    Appointment.create.mockRejectedValue(new Error(errorMessage));

 
    await postAppointment(req, res);

   
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});
describe('deleteappointment', () => {
    it('should delete an appointment', async () => {
      const mockAppointment = {
        _id: '123',
        title: 'Test Appointment',
        date: '2024-01-31',
        time: '10:00 AM',
      };
  
   
      Appointment.findOneAndDelete.mockResolvedValue(mockAppointment);
  
     
      const req = { params: { id: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
    
      await deleteappointment(req, res);
  
   
      expect(Appointment.findOneAndDelete).toHaveBeenCalledWith({ _id: '123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAppointment);
    });
  
    it('should handle not found appointment for deletion', async () => {
     
      Appointment.findOneAndDelete.mockResolvedValue(null);
  
     
      const req = { params: { id: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
    
      await deleteappointment(req, res);
  
     
      expect(Appointment.findOneAndDelete).toHaveBeenCalledWith({ _id: '123' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'No such appointment' });
    });
  });
  describe('getSingleAppointment', () => {
    it('should return a single appointment', async () => {
      const mockAppointment = {
        _id: '123',
        title: 'Test Appointment',
        date: '2024-01-31',
        time: '10:00 AM',
      };
  
   
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
  

      Appointment.findById.mockResolvedValue(mockAppointment);
  
      const req = { params: { id: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await getSingleAppointment(req, res);
  
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('123');
      expect(Appointment.findById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAppointment);
    });
  
    it('should handle invalid appointment ID', async () => {
      // Mocking mongoose.Types.ObjectId.isValid
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);
  
      const req = { params: { id: 'invalid_id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
    
      await getSingleAppointment(req, res);
  
     
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('invalid_id');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No such workout' });
    });
    it('should handle not found appointment', async () => {
       
        mongoose.Types.ObjectId.isValid.mockReturnValue(true);
    
      
        Appointment.findById.mockResolvedValue(null);
    
      
        const req = { params: { id: '123' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
       
        await getSingleAppointment(req, res);
    
        
        expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('123');
        expect(Appointment.findById).toHaveBeenCalledWith('123');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'No such workout' });
      });
  
   
  });
  describe('updateAppointment', () => {
    it('should update an appointment', async () => {
      const mockAppointment = {
        _id: '123',
        title: 'Updated Title',
        date: '2024-02-01',
        time: '12:00 PM',
      };
  
     
      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
  
     
      Appointment.findOneAndUpdate.mockResolvedValue(mockAppointment);
  
 
      const req = { params: { id: '123' }, body: { title: 'Updated Title' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
    
      await updateAppointment(req, res);
  
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('123');
      expect(Appointment.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '123' },
        { title: 'Updated Title' },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAppointment);
    });
  
    it('should handle invalid workout ID', async () => {
     
      mongoose.Types.ObjectId.isValid.mockReturnValue(false);
  
      const req = { params: { id: 'invalid_id' }, body: { title: 'Updated Title' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
    
      await updateAppointment(req, res);
  
      
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('invalid_id');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'No such workout' });
    });
  
    it('should handle not found appointment', async () => {
     
      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
  
   
      Appointment.findOneAndUpdate.mockResolvedValue(null);
  
    
      const req = { params: { id: '123' }, body: { title: 'Updated Title' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
    
      await updateAppointment(req, res);
  
  
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('123');
      expect(Appointment.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '123' },
        { title: 'Updated Title' },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });


