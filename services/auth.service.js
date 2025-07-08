import admin from '../utils/firebase.js';
import { USERS_COLLECTION } from '../models/user.model.js';

const db = admin.firestore();

export const createUser = async (firstname, email, password) => {

  const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName:firstname
        });
  if(userRecord){
            await db.collection(USERS_COLLECTION).doc(userRecord.uid).set({
                uid: userRecord.uid,
                email: userRecord.email,
                fullname: firstname,
                role : "user",
                createdAt : new Date()
            });
        }
  return userRecord;
};

export const getUserByEmail = async (email) => {
  const snapshot = await db.collection(USERS_COLLECTION).where('email', '==', email).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}; 