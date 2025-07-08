import bcrypt from 'bcryptjs';
import * as authService from '../services/auth.service.js';

export const signup = async (req, res, next) => {
  const { firstname, email, password } = req.body;
    if (!firstname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

  try {
    
    // const existingUser = await authService.getUserByEmail(email);
    // if (existingUser) {
    //   return res.status(409).json({ message: 'Email already exists' });
    // }
    const user = await authService.createUser(firstname, email, password);
    res.status(201).json({ data: user, status:true });
    res.status(200).json({
            status : true,
            message : 'User creates successfully.',
            data : user
        });
  } catch (error) {
        res.status(400).json({
            status:false,
            message: 'User creation failed.',
            error : error.message
        });
    }
}; 

