import express from 'express';
import multer from 'multer';
import { addEmployee, getEmployees, updateEmployee, deleteEmployee,getEmployee } from '../controllers/employeeController.js';

const router = express.Router();

// Multer setup for image uploads
const storage = multer.memoryStorage(); // Temporarily store in memory
const upload = multer({ storage });

// Employee routes
router.post('/', upload.single('photo'), addEmployee);
router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.put('/:id', upload.single('photo'), updateEmployee);
router.delete('/:id', deleteEmployee);


export default router;
