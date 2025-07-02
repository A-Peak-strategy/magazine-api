import * as issueService from '../services/issue.service.js';
import { uploadBuffer } from '../utils/cloudinary.js';

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

export const deleteIssue = async (req, res, next) => {
  try {
    await issueService.deleteIssue(req.params.id);
    res.json({ message: 'Issue deleted' });
  } catch (err) {
    next(err);
  }
}; 