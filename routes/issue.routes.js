import { Router } from 'express';
import * as issueController from '../controllers/issue.controller.js';
import { upload } from '../middlewares/upload.middleware.js';
const router = Router();

router.post('/', upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), issueController.createIssue);
router.get('/', issueController.getIssues);
router.get('/latest', issueController.getLatestIssue);
router.get('/:id', issueController.getIssueById);
router.put('/:id', upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), issueController.updateIssue);
router.delete('/:id', issueController.deleteIssue);
router.post('/:id/save', issueController.toggleSavedIssue);
router.post('/is-saved', issueController.isIssueSaved);
router.get('/saved/:userId', issueController.getSavedIssues );

export default router; 