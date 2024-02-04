const Appointment = require('../models/model')
const mongoose = require('mongoose')

const getAllAppointment = async (req,res) =>{
    const appointments = await Appointment.find({})
    res.status(200).json(appointments)

}

const postAppointment = async (req,res)=>{
    const {title,date,time} = req.body;

  
    const existingAppointment = await Appointment.findOne({ date, time });
    if (existingAppointment) {
        return res.status(409).json({ error: 'Slot already booked.' });
    }
    try {
        const appointment = await Appointment.create({title,date,time})
        res.status(200).json(appointment)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getSingleAppointment = async (req,res)=>{
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
      }

      const appointment = await Appointment.findById(id)
      if(!appointment){
        res.status(400).json({ error: 'No such workout'  })
      }
      if(appointment){
        res.status(200).json(appointment)
      }
}

const deleteappointment = async (req,res)=>{
    const { id } = req.params

   

    const appointment = await Appointment.findOneAndDelete({_id: id})

    if(!appointment) {
        return res.status(400).json({error: 'No such appointment'})
    }

    res.status(200).json(appointment)
}

const updateAppointment = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'No such workout' });
    }
  
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true } 
    );
  
    if (!updatedAppointment) {
      return res.status(400).json({ error: 'No such appointment' });
    }
  
    res.status(200).json(updatedAppointment);
  };
  

module.exports = {getAllAppointment,postAppointment,getSingleAppointment,deleteappointment,updateAppointment}