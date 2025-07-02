import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { upload } from '../middlewares/upload.middleware.js';
const router = Router();

router.post('/', upload.single('image'), categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', upload.single('image'), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router; 