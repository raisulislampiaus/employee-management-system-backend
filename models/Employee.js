// models/Employee.js
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  photoUrl: {
    type: String,
    required: false,
  },
  cloudinaryId: {
    type: String,
    required: false,
  },
});

export default mongoose.model('Employee', employeeSchema);
