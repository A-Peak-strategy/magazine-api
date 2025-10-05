import * as blogService from "../services/blog.service.js";
import { uploadBuffer } from "../utils/cloudinary.js";

export const createBlog = async (req, res, next) => {
  try {
    let images = [];
    if (req.files && req.files.length > 0) {
      images = await Promise.all(
        req.files.map((file) => uploadBuffer(file.buffer, "blogs"))
      );
      images = images.map((img) => img.secure_url);
    }

    const { title, author, description, date, categoryId, categoryName, position, videoURL, excerpt, type } =
      req.body;

    const blogData = {
      title,
      author,
      description: JSON.parse(req.body.description),
      date,
      type,
      categoryId,
      categoryName,
      position,
      variations: JSON.parse(req.body.variations),
      images, 
      videoURL : videoURL ? videoURL : null,
      excerpt : excerpt ? excerpt : null
    };

    const blog = await blogService.createBlog(blogData);
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
};

// export const updateBlog = async (req, res, next) => {
//   try {
//     let images = req.body.images || [];
//     if (req.files && req.files.length > 0) {
//       images = await Promise.all(
//         req.files.map((file) => uploadBuffer(file.buffer, "blogs"))
//       );
//       images = images.map((img) => img.secure_url);
//     }
//     const blog = await blogService.updateBlog(req.params.id, {
//       ...req.body,
//       images,
//     });
//     res.json(blog);
//   } catch (err) {
//     next(err);
//   }
// };

export const updateBlog = async (req, res, next) => {
  try {
    let images = [];

    // Keep existing images (sent as JSON string)
    if (req.body.images) {
      const parsed = JSON.parse(req.body.images);
      images = Array.isArray(parsed) ? parsed : [];
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const uploaded = await Promise.all(
        req.files.map((file) => uploadBuffer(file.buffer, "blogs"))
      );
      images.push(...uploaded.map((img) => img.secure_url));
    }

    const blog = await blogService.updateBlog(req.params.id, {
      ...req.body,
      description: JSON.parse(req.body.description || "[]"),
      variations: JSON.parse(req.body.variations || "[]"),
      images,
    });

    res.json(blog);
  } catch (err) {
    next(err);
  }
};

export const getBlogs = async (req, res, next) => {
  try {
    const blogs = await blogService.getBlogs();
    res.json(blogs);
  } catch (err) {
    next(err);
  }
};

export const getBlogById = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    await blogService.deleteBlog(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    next(err);
  }
};

export const toggleFavoriteBlog = async (req, res) => {
  try {
    const { id: blogId } = req.params;
    const { userId } = req.body;

    const result = await blogService.toggleFavoriteBlogInService(userId, blogId);
    res.json(result);
  } catch (err) {
    console.error('Toggle favorite error:', err.message);
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
};

export const isBlogFavorited = async (req, res) => {
  const { blogId, userId } = req.query;

  try {
    const isFavorited = await blogService.checkIfFavorited(userId, blogId);
    res.status(200).json({ isFavorited });
  } catch (error) {
    console.error('Error in isBlogFavorited:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getFavouriteBlogs = async (req, res) => {
  const { userId } = req.params;

  try {
    const blogs = await blogService.fetchFavouriteBlogDetails(userId);
    res.status(200).json({ favouriteBlogs: blogs });
  } catch (error) {
    console.error('Error fetching favourite blogs:', error);
    res.status(500).json({ error: 'Failed to fetch favourite blogs' });
  }
};

export const getRandomBlogsByCategory = async (req, res) => {
    try {
        const blogs = await blogService.getRandomBlogsByCategory();
        res.status(200).json({ success: true, blogs });
    } catch (error) {
        console.error("Error fetching random blogs:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};