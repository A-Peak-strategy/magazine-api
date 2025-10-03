import admin from "../utils/firebase.js";

const db = admin.firestore();

/**
 * Document path used to store the emails array
 * { emails: [ "a@b.com", ... ] }
 */
const COLLECTION = "newsletter";
const DOC_ID = "subscribers";
const docRef = db.collection(COLLECTION).doc(DOC_ID);

export const ensureDocExists = async () => {
  const snap = await docRef.get();
  if (!snap.exists) {
    await docRef.set({ emails: [] });
  }
};

export const getAllEmails = async () => {
  await ensureDocExists();
  const snap = await docRef.get();
  const data = snap.data();
  return Array.isArray(data?.emails) ? data.emails : [];
};

/**
 * Adds email using arrayUnion (idempotent - won't add duplicate)
 * returns { added: boolean, emails: [...] }
 */
export const addEmail = async (email) => {
  await ensureDocExists();

  // Read current list to know whether it exists before adding
  const snap = await docRef.get();
  const current = snap.data()?.emails || [];

  const already = current.includes(email.toLowerCase());
  if (already) {
    return { added: false, emails: current };
  }

  await docRef.update({
    emails: admin.firestore.FieldValue.arrayUnion(email.toLowerCase()),
  });

  const updatedSnap = await docRef.get();
  return { added: true, emails: updatedSnap.data().emails || [] };
};

/**
 * Remove email (unsubscribe)
 */
export const removeEmail = async (email) => {
  await ensureDocExists();
  await docRef.update({
    emails: admin.firestore.FieldValue.arrayRemove(email.toLowerCase()),
  });
  const snap = await docRef.get();
  return snap.data().emails || [];
};

/**
 * Check if an email is already saved
 */
export const hasEmail = async (email) => {
  const emails = await getAllEmails();
  return emails.includes(email.toLowerCase());
};
