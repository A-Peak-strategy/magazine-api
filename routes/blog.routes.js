import { Router } from 'express';
import * as blogController from '../controllers/blog.controller.js';
import { upload } from '../middlewares/upload.middleware.js';
const router = Router();

router.post('/', upload.array('images', 10), blogController.createBlog);
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', upload.array('images', 10), blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);
router.post('/:id/favorite', blogController.toggleFavoriteBlog);
router.post('/is-favorited', blogController.isBlogFavorited);
router.get('/favourites/:userId', blogController.getFavouriteBlogs);
router.get('/random/category', blogController.getRandomBlogsByCategory);
export default router; 