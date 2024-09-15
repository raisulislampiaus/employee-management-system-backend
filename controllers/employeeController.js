import Employee from "../models/Employee.js";
import { uploadToCloudinary, resizeImage } from "../utils/imageHelpers.js";


export const addEmployee = async (req, res) => {
  try {
    const { fullName, email, mobile, dateOfBirth } = req.body;

    
    let photoUrl = "";
    if (req.file) {
      const resizedImage = await resizeImage(req.file.buffer); 
      const cloudinaryResult = await uploadToCloudinary(resizedImage); 
      photoUrl = cloudinaryResult.secure_url; 
    }

    const newEmployee = new Employee({
      fullName,
      email,
      mobile,
      dateOfBirth,
      photoUrl,
    });

    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      res
        .status(400)
        .json({ message: "Email already exists, please use a different one." });
    } else {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
};







export const getEmployees = async (req, res) => {
  const { page = 1, limit = 10, name, dateOfBirth, email, mobile,sortBy, sortOrder = 'asc' } = req.query;

  try {
    // Build the search query based on the provided fields
    let searchQuery = {};
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    if (name) {
      searchQuery.fullName = { $regex: name, $options: "i" };
    }
    if (dateOfBirth) {
      searchQuery.dateOfBirth = dateOfBirth; // Assuming dateOfBirth is stored in the correct format
    }
    if (email) {
      searchQuery.email = { $regex: email, $options: "i" };
    }
    if (mobile) {
      searchQuery.mobile = { $regex: mobile, $options: "i" };
    }

    // Fetch employees with filters and pagination
    const employees = await Employee.find(searchQuery)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Employee.countDocuments(searchQuery);

    res.json({
      employees,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const { fullName, email, mobile, dateOfBirth } = req.body;
    employee.fullName = fullName || employee.fullName;
    employee.email = email || employee.email;
    employee.mobile = mobile || employee.mobile;
    employee.dateOfBirth = dateOfBirth || employee.dateOfBirth;

    if (req.file) {
      const resizedImage = await resizeImage(req.file.buffer);
      const cloudinaryResult = await uploadToCloudinary(resizedImage);
      employee.photoUrl = cloudinaryResult.secure_url;
    }

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await employee.remove();
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};