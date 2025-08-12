import admin from '../utils/firebase.js';
import { ISSUES_COLLECTION } from '../models/issue.model.js';

const db = admin.firestore();

export const createIssue = async (data) => {
  const docRef = await db.collection(ISSUES_COLLECTION).add(data);
  return { id: docRef.id, ...data, status:false };
};

export const getIssues = async () => {
  const snapshot = await db.collection(ISSUES_COLLECTION).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), status:false }));
};

export const getIssueById = async (id) => {
  const doc = await db.collection(ISSUES_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data(), status:false };
};

export const updateIssue = async (id, data) => {
  await db.collection(ISSUES_COLLECTION).doc(id).update(data);
  return getIssueById(id);
};

export const deleteIssue = async (id) => {
  await db.collection(ISSUES_COLLECTION).doc(id).delete();
  return { id, status:false };
}; 

export const toggleSavedIssueInService = async (userId, issueId) => {
  const userRef = db.collection('users').doc(userId);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new Error('User not found');
  }

  const userData = userSnap.data();
  const currentSavedIssues = userData.savedIssues || [];

  if (currentSavedIssues.includes(issueId)) {
    await userRef.update({
      savedIssues: admin.firestore.FieldValue.arrayRemove(issueId),
    });
    return { message: 'Removed from favorites', isSaved: false };
  } else {
    await userRef.update({
      savedIssues: admin.firestore.FieldValue.arrayUnion(issueId),
    });
    return { message: 'Added to favorites', isSaved: true };
  }
};

export const checkIfSaved = async (userId, issueId) => {
  const userRef = db.collection('users').doc(userId);
  const doc = await userRef.get();

  if (!doc.exists) throw new Error('User not found');

  const savedIssues = doc.data().savedIssues || [];
  return savedIssues.includes(issueId);
};


export const fetchSavedIssueDetails = async (userId) => {
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) throw new Error('User not found');

  const savedIssues = userDoc.data().savedIssues || [];

  if (savedIssues.length === 0) return [];

  const issuePromises = savedIssues.map(id =>
    db.collection('issues').doc(id).get()
  );

  const issueDoc = await Promise.all(issuePromises);

  const issues = issueDoc
    .filter(doc => doc.exists)
    .map(doc => ({ id: doc.id, ...doc.data() }));

  return issues;
};