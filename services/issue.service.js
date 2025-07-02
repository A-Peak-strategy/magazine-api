import admin from '../utils/firebase.js';
import { ISSUES_COLLECTION } from '../models/issue.model.js';

const db = admin.firestore();

export const createIssue = async (data) => {
  const docRef = await db.collection(ISSUES_COLLECTION).add(data);
  return { id: docRef.id, ...data };
};

export const getIssues = async () => {
  const snapshot = await db.collection(ISSUES_COLLECTION).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getIssueById = async (id) => {
  const doc = await db.collection(ISSUES_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const updateIssue = async (id, data) => {
  await db.collection(ISSUES_COLLECTION).doc(id).update(data);
  return getIssueById(id);
};

export const deleteIssue = async (id) => {
  await db.collection(ISSUES_COLLECTION).doc(id).delete();
  return { id };
}; 