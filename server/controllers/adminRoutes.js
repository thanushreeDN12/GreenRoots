import mongoose from 'mongoose';
import Photo from '../models/photo.js';
import { calculateTotalCarbon } from '../utils/carbonCalc.js';

// Returns map data of verified tree photos (with optional userEmail filter)
export const getMapData = async (req, res) => {
  try {
    const { userEmail } = req.query;
    let query = { verified: true };

    if (userEmail && userEmail.trim()) {
      const cleanEmail = userEmail.trim().toLowerCase();
      query.userEmail = cleanEmail;
    }

    const photos = await Photo.find(query)
      .populate('programId', 'title location state donationCost')
      .lean();

    const mapData = [];
    for (let i = 0; i < photos.length; i++) {
      const p = photos[i];
      if (p.location && p.location.coordinates && p.location.coordinates.length === 2) {
        const lng = p.location.coordinates[0];
        const lat = p.location.coordinates[1];
        if (lat && lng) {
          mapData.push({
            _id: p._id,
            lat: lat,
            lng: lng,
            species: p.treeSpecies || 'Native Tree',
            uploadedBy: p.userEmail,
            programTitle: p.programId ? p.programId.title : 'Reforestation Site',
            programLocation: p.programId ? p.programId.location : '',
            dedication: p.dedication || '',
            cheers: p.cheers || 0,
            photoUrl: p.photoUrl || (p.imageId ? `/admin/getPhoto/${p.imageId}` : '')
          });
        }
      }
    }

    res.json(mapData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload photo handler: stores image in GridFS or uses external URL
export const uploadPhoto = async (req, res) => {
  try {
    const { userEmail, description, treeSpecies, latitude, longitude, dedication, locationSource, programId, photoUrl } = req.body;
    const cleanEmail = userEmail ? userEmail.trim().toLowerCase() : '';

    if (!req.file && !photoUrl) {
      return res.status(400).json({ message: 'Either an image file or a valid photo URL must be provided' });
    }

    // When an image file is uploaded, save it to MongoDB GridFS
    if (req.file) {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'photos' });
      const uploadStream = bucket.openUploadStream(req.file.originalname, { contentType: req.file.mimetype });

      uploadStream.end(req.file.buffer);

      uploadStream.on('error', (err) => {
        console.error('GridFS upload error:', err);
        return res.status(500).json({ message: 'Upload failed' });
      });

      uploadStream.on('finish', async () => {
        const files = await bucket.find({ filename: req.file.originalname }).sort({ uploadDate: -1 }).toArray();
        if (!files || files.length === 0) {
          return res.status(500).json({ message: 'Uploaded file not found' });
        }

        const file = files[0];

        const newPhoto = new Photo({
          userEmail: cleanEmail,
          description: description || '',
          treeSpecies: treeSpecies || 'Native Tree',
          location: {
            type: "Point",
            locationSource: locationSource || 'manual-pin',
            coordinates: [parseFloat(longitude) || 78.9629, parseFloat(latitude) || 20.5937]
          },
          imageId: file._id,
          programId: programId || null,
          verified: true,
          dedication: dedication || ''
        });

        const savedPhoto = await newPhoto.save();
        return res.status(201).json(savedPhoto);
      });
      return;
    }

    // Direct photoUrl provided
    const newPhoto = new Photo({
      userEmail: cleanEmail,
      description: description || '',
      treeSpecies: treeSpecies || 'Native Tree',
      photoUrl: photoUrl.trim(),
      location: {
        type: "Point",
        locationSource: locationSource || 'manual-pin',
        coordinates: [parseFloat(longitude) || 78.9629, parseFloat(latitude) || 20.5937]
      },
      programId: programId || null,
      verified: true,
      dedication: dedication || ''
    });

    const savedPhoto = await newPhoto.save();
    return res.status(201).json(savedPhoto);
  } catch (error) {
    console.error('Upload handler error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Periodic tree growth check-in by admin
export const checkInPhoto = async (req, res) => {
  try {
    const { photoId, note, photoUrl } = req.body;

    if (!req.file && !photoUrl) {
      return res.status(400).json({ message: 'Either an image file or a photo URL must be provided for check-in' });
    }

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Tree photo not found' });
    }

    // If an image file is uploaded, stream to GridFS
    if (req.file) {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'photos' });
      const uploadStream = bucket.openUploadStream(req.file.originalname, { contentType: req.file.mimetype });
      uploadStream.end(req.file.buffer);

      uploadStream.on('error', (err) => {
        console.error('CheckIn upload error:', err);
        return res.status(500).json({ message: 'Upload failed' });
      });

      uploadStream.on('finish', async () => {
        const files = await bucket.find({ filename: req.file.originalname }).sort({ uploadDate: -1 }).toArray();
        if (!files || files.length === 0) {
          return res.status(500).json({ message: 'Uploaded file not found' });
        }
        const file = files[0];

        photo.checkIns.push({
          photoUrl: `/admin/getPhoto/${file._id}`,
          note: note || "",
          verified: true,
          date: new Date()
        });
        await photo.save();
        return res.status(201).json(photo);
      });
      return;
    }

    // Direct photoUrl supplied
    photo.checkIns.push({
      photoUrl: photoUrl.trim(),
      note: note || "",
      verified: true,
      date: new Date()
    });
    await photo.save();
    return res.status(201).json(photo);
  } catch (error) {
    console.error('Check-in error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Fetch photos for a specific user or all verified photos
export const getPhoto = async (req, res) => {
  try {
    const { userEmail } = req.query;
    let query = {};
    if (userEmail && userEmail.trim()) {
      const escaped = userEmail.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.userEmail = { $regex: new RegExp(`^${escaped}$`, 'i') };
    } else {
      query.verified = true;
    }

    const photos = await Photo.find(query)
      .populate('programId', 'title location state donationCost')
      .select('-__v')
      .sort({ uploadDate: -1 })
      .lean();

    const totalCarbon = calculateTotalCarbon(photos);

    res.json({ photos, totalCarbon });
  } catch (error) {
    console.error("Mongoose fetch error:", error.message);
    res.status(409).json({ message: error.message });
  }
};

// Stream photo binary from GridFS
export const servePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const fileId = new mongoose.Types.ObjectId(id);

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'photos',
    });

    const files = await bucket.find({ _id: fileId }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = files[0];
    const mimeType = file.contentType && file.contentType !== 'false' ? file.contentType : 'image/jpeg';
    res.set('Content-Type', mimeType);

    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.pipe(res);

    downloadStream.on('error', (err) => {
      console.error('Error streaming file:', err);
      res.status(500).json({ message: 'Error streaming file' });
    });
  } catch (error) {
    console.error('Invalid file id:', error);
    res.status(400).json({ message: 'Invalid file id' });
  }
};

// Cheer reaction increment
export const cheerPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findByIdAndUpdate(
      id,
      { $inc: { cheers: 1 } },
      { new: true }
    );
    if (!photo) {
      return res.status(404).json({ message: 'Tree photo not found' });
    }
    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
