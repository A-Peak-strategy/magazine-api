import admin from '../utils/firebase.js';
import { CATEGORIES_COLLECTION } from '../models/category.model.js';

const db = admin.firestore();

export const createCategory = async (data) => {
  const docRef = await db.collection(CATEGORIES_COLLECTION).add(data);
  return { id: docRef.id, ...data };
};

export const getCategories = async () => {
  const snapshot = await db.collection(CATEGORIES_COLLECTION).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getCategoryById = async (id) => {
  const doc = await db.collection(CATEGORIES_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const updateCategory = async (id, data) => {
  await db.collection(CATEGORIES_COLLECTION).doc(id).update(data);
  return getCategoryById(id);
};

export const deleteCategory = async (id) => {
  await db.collection(CATEGORIES_COLLECTION).doc(id).delete();
  return { id };
};