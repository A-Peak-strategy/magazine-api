import admin from '../utils/firebase.js';
import { BLOGS_COLLECTION } from '../models/blog.model.js';

const db = admin.firestore();

export const createBlog = async (data) => {
  const docRef = await db.collection(BLOGS_COLLECTION).add(data);
  return { id: docRef.id, ...data };
};

export const getBlogs = async () => {
  const snapshot = await db.collection(BLOGS_COLLECTION).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getBlogById = async (id) => {
  const doc = await db.collection(BLOGS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const updateBlog = async (id, data) => {
  await db.collection(BLOGS_COLLECTION).doc(id).update(data);
  return getBlogById(id);
};

export const deleteBlog = async (id) => {
  await db.collection(BLOGS_COLLECTION).doc(id).delete();
  return { id };
};
