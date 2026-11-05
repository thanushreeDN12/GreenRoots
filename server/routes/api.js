import express from 'express';
import { getImpactSummary, getRecentActivity, getTestimonials, getPublicPhotos, getCities, getSpecies } from '../controllers/api.js';

const router = express.Router();

// Part B: Impact summary endpoint
router.get('/impact/summary', getImpactSummary);

// Part C: Recent activity endpoint
router.get('/activity/recent', getRecentActivity);

// Public photos endpoint
router.get('/photos/public', getPublicPhotos);

router.get('/testimonials', getTestimonials);

// Fetch cities and tree species stored in MongoDB
router.get('/cities', getCities);
router.get('/species', getSpecies);

export default router;

