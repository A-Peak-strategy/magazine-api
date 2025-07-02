import * as categoryService from '../services/category.service.js';
import { uploadBuffer } from '../utils/cloudinary.js';

export const createCategory = async (req, res, next) => {
  try {
    let image = '';
    if (req.file) {
      const result = await uploadBuffer(req.file.buffer, 'categories');
      image = result.secure_url;
    }
    const category = await categoryService.createCategory({ ...req.body, image });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    let image = req.body.image || '';
    if (req.file) {
      const result = await uploadBuffer(req.file.buffer, 'categories');
      image = result.secure_url;
    }
    const category = await categoryService.updateCategory(req.params.id, { ...req.body, image });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
}; 