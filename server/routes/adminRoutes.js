import { Router } from 'express';
import multer from 'multer';
import { uploadPhoto, getPhoto, servePhoto, checkInPhoto, getMapData, cheerPhoto } from '../controllers/adminRoutes.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

// Map route
router.get('/map', getMapData);

// Upload photo route with multer middleware
router.post('/uploadPhoto', upload.single('photo'), uploadPhoto);
router.post('/checkin', upload.single('photo'), checkInPhoto); // Part D: check-in photo

// Emotional impact cheer route
router.post('/photo/:id/cheer', cheerPhoto);

// Route to get photo metadata filtered by userEmail
router.get('/getPhoto', getPhoto);

// Route to serve the actual image binary by imageId
router.get('/getPhoto/:id', servePhoto);

export default router;
