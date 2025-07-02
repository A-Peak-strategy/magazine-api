export const BLOGS_COLLECTION = 'blogs';

export const blogSchema = {
  title: '',
  author: '',
  date: '',
  images: [], // array of image URLs
  description: '',
  variations: [
    // { title: '', description: '' }
  ],
  categoryID: '',
  categoryName: '',
  position: 0,
}; 