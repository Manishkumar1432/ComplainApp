const express = require('express');
const auth = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const s3 = require('../config/s3');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

function isS3Configured() {
  return Boolean(
    process.env.AWS_BUCKET_NAME &&
    process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY &&
    process.env.AWS_SECRET_KEY
  );
}

// Create complaint
router.post('/', auth, upload.array('photos', 5), async (req, res) => {
  const { title, description, category, location } = req.body;
  const photos = [];
  const failedUploads = [];
  const normalizedCategory = typeof category === 'string' ? category.trim() : '';

  try {
    if (!title || !description || !normalizedCategory) {
      return res.status(400).json({ msg: 'Title, description and category are required' });
    }

    if (req.files && req.files.length > 0) {
      if (!isS3Configured()) {
        console.warn('S3 is not fully configured. Skipping photo uploads.');
      } else {
        for (const file of req.files) {
          try {
            const key = `${Date.now()}-${file.originalname}`.replace(/\s+/g, '_');
            const uploadParams = {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: key,
              Body: file.buffer,
              ContentType: file.mimetype,
            };

            await s3.send(new PutObjectCommand(uploadParams));
            const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            photos.push(fileUrl);
          } catch (fileErr) {
            console.error('Photo upload failed for a file:', fileErr.message);
            failedUploads.push(file.originalname);
          }
        }
      }
    }

    const complaint = new Complaint({
      user: req.user.id,
      title,
      description,
      category: normalizedCategory,
      location,
      photos,
    });

    await complaint.save();
    if (failedUploads.length > 0) {
      return res.status(201).json({
        ...complaint.toObject(),
        warning: 'Complaint saved, but some photos could not be uploaded.',
        failedUploads,
      });
    }

    res.status(201).json(complaint);
  } catch (err) {
    console.error('Complaint submit error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }

    res.status(500).json({ msg: 'Server error while submitting complaint', error: err.message });
  }
});

// Get all complaints (public view)
router.get('/all', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user's complaints
router.get('/', auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get complaint by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }
    if (complaint.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update complaint status (for admin, but for now user can update)
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;
  try {
    let complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }
    if (complaint.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    complaint.status = status;
    complaint.updatedAt = Date.now();
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;