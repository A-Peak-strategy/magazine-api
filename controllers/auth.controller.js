import bcrypt from 'bcryptjs';
import * as authService from '../services/auth.service.js';

export const signup = async (req, res, next) => {
  try {
    const { firstname, email, password } = req.body;
    if (!firstname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await authService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await authService.createUser({ firstname, email, passwordHash });
    res.status(201).json({ id: user.id, firstname, email });
  } catch (err) {
    next(err);
  }
}; 