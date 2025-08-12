import { getFirestore } from 'firebase-admin/firestore';
import * as issueService from '../services/issue.service.js';
import { deleteImageFromCloudinary, uploadBuffer } from '../utils/cloudinary.js';
const db = getFirestore();

export const createIssue = async (req, res, next) => {
  try {
    let coverImage = '';
    let pdf = '';
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      const result = await uploadBuffer(req.files.coverImage[0].buffer, 'issues');
      coverImage = result.secure_url;
    }
    if (req.files && req.files.pdf && req.files.pdf[0]) {
      const result = await uploadBuffer(req.files.pdf[0].buffer, 'issues', 'raw');
      pdf = result.secure_url;
    }
    const issue = await issueService.createIssue({ ...req.body, coverImage, pdf });
    res.status(201).json(issue);
  } catch (err) {
    next(err);
  }
};

export const getIssues = async (req, res, next) => {
  try {
    const issues = await issueService.getIssues();
    res.json(issues);
  } catch (err) {
    next(err);
  }
};

export const getIssueById = async (req, res, next) => {
  try {
    const issue = await issueService.getIssueById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    next(err);
  }
};

export const updateIssue = async (req, res, next) => {
  try {
    let coverImage = req.body.coverImage || '';
    let pdf = req.body.pdf || '';
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      const result = await uploadBuffer(req.files.coverImage[0].buffer, 'issues');
      coverImage = result.secure_url;
    }
    if (req.files && req.files.pdf && req.files.pdf[0]) {
      const result = await uploadBuffer(req.files.pdf[0].buffer, 'issues', 'raw');
      pdf = result.secure_url;
    }
    const issue = await issueService.updateIssue(req.params.id, { ...req.body, coverImage, pdf });
    res.json(issue);
  } catch (err) {
    next(err);
  }
};

// export const deleteIssue = async (req, res, next) => {
//   try {
//     await issueService.deleteIssue(req.params.id);
//     res.json({ message: 'Issue deleted' });
//   } catch (err) {
//     next(err);
//   }
// }; 

export const deleteIssue = async (req, res) => {
  const { id } = req.params;

  try {
    const docRef = db.collection('issues').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const data = doc.data();

    // Delete cover image
    if (data.coverImage) {
      await deleteImageFromCloudinary(data.coverImage);
    }

    // Delete all page images
    if (Array.isArray(data.pages)) {
      for (const url of data.pages) {
        await deleteImageFromCloudinary(url);
      }
    }

    // Delete document
    await docRef.delete();

    res.json({ success: true, message: 'Issue and images deleted successfully.' });
  } catch (err) {
    console.error('❌ Delete failed:', err.message);
    res.status(500).json({ error: 'Failed to delete issue' });
  }
};

export const toggleSavedIssue = async (req, res) => {
  try {
    const { id: issueId } = req.params;
    const { userId } = req.body;

    const result = await issueService.toggleSavedIssueInService(userId, issueId);
    res.json(result);
  } catch (err) {
    console.error('Toggle favorite error:', err.message);
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
};

export const isIssueSaved = async (req, res) => {
  const { issueId, userId } = req.query;

  try {
    const isSaved = await issueService.checkIfSaved(userId, issueId);
    res.status(200).json({ isSaved });
  } catch (error) {
    console.error('Error in isIssueSaved:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getSavedIssues= async (req, res) => {
  const { userId } = req.params;

  try {
    const issues = await issueService.fetchSavedIssueDetails(userId);
    res.status(200).json({ savedIssues: issues });
  } catch (error) {
    console.error('Error fetching saved issues :', error);
    res.status(500).json({ error: 'Failed to fetch saved issues' });
  }
};