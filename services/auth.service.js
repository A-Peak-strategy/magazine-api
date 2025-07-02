import admin from '../utils/firebase.js';
import { USERS_COLLECTION } from '../models/user.model.js';

const db = admin.firestore();

export const createUser = async (data) => {
  const docRef = await db.collection(USERS_COLLECTION).add(data);
  return { id: docRef.id, ...data };
};

export const getUserByEmail = async (email) => {
  const snapshot = await db.collection(USERS_COLLECTION).where('email', '==', email).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}; 