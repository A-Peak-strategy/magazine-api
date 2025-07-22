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

export const updateBlog = async (req, res, next) => {
  try {
    let images = req.body.images || [];
    if (req.files && req.files.length > 0) {
      images = await Promise.all(
        req.files.map((file) => uploadBuffer(file.buffer, "blogs"))
      );
      images = images.map((img) => img.secure_url);
    }
    const blog = await blogService.updateBlog(req.params.id, {
      ...req.body,
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
