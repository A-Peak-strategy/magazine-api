import admin from '../utils/firebase.js';
import { BLOGS_COLLECTION } from '../models/blog.model.js';

const db = admin.firestore();

export const createBlog = async (data) => {
  // Parse JSON strings back to objects/arrays before saving
  const processedData = {
    ...data,
    description: typeof data.description === 'string' ? JSON.parse(data.description) : data.description,
    variations: typeof data.variations === 'string' ? JSON.parse(data.variations) : data.variations
  };

  const docRef = await db.collection(BLOGS_COLLECTION).add(processedData);
  return { id: docRef.id, ...processedData };
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

export const toggleFavoriteBlogInService = async (userId, blogId) => {
  const userRef = db.collection('users').doc(userId);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new Error('User not found');
  }

  const userData = userSnap.data();
  const currentFavorites = userData.favouriteBlogs || [];

  if (currentFavorites.includes(blogId)) {
    await userRef.update({
      favouriteBlogs: admin.firestore.FieldValue.arrayRemove(blogId),
    });
    return { message: 'Removed from favorites', isFavorited: false };
  } else {
    await userRef.update({
      favouriteBlogs: admin.firestore.FieldValue.arrayUnion(blogId),
    });
    return { message: 'Added to favorites', isFavorited: true };
  }
};

export const checkIfFavorited = async (userId, blogId) => {
  const userRef = db.collection('users').doc(userId);
  const doc = await userRef.get();

  if (!doc.exists) throw new Error('User not found');

  const favorites = doc.data().favouriteBlogs || [];
  return favorites.includes(blogId);
};


export const fetchFavouriteBlogDetails = async (userId) => {
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) throw new Error('User not found');

  const favouriteIds = userDoc.data().favouriteBlogs || [];

  if (favouriteIds.length === 0) return [];

  const blogPromises = favouriteIds.map(id =>
    db.collection('blogs').doc(id).get()
  );

  const blogDocs = await Promise.all(blogPromises);

  const blogs = blogDocs
    .filter(doc => doc.exists)
    .map(doc => ({ id: doc.id, ...doc.data() }));

  return blogs;
};

export const getRandomBlogsByCategory = async () => {
    const blogSnapshot = await db.collection("blogs").get();
    const allBlogs = blogSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const grouped = {};
    allBlogs.forEach(blog => {
        if (!grouped[blog.categoryId]) {
            grouped[blog.categoryId] = [];
        }
        grouped[blog.categoryId].push(blog);
    });

    const randomBlogs = Object.values(grouped)
        .map(blogsInCategory => {
            const randomIndex = Math.floor(Math.random() * blogsInCategory.length);
            return blogsInCategory[randomIndex];
        });

    const shuffled = randomBlogs.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
};