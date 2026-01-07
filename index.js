
// index.js - Node.js + Express Backend
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Multer setup for file uploads (memory storage for simplicity)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedImage = ['image/jpeg', 'image/png'];
    const allowedAudio = ['audio/mpeg', 'audio/wav', 'audio/wave'];
    
    if (file.fieldname === 'image' && allowedImage.includes(file.mimetype)) {
      cb(null, true);
    } else if (file.fieldname === 'audio' && allowedAudio.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}`));
    }
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Backend is live!');
});

// Render endpoint
app.post('/render', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]), async (req, res) => {
  try {
    // Validate files exist
    if (!req.files?.image?.[0]) {
      return res.status(400).json({
        status: 'error',
        error: 'Image file is required'
      });
    }
    
    if (!req.files?.audio?.[0]) {
      return res.status(400).json({
        status: 'error',
        error: 'Audio file is required'
      });
    }

    const imageFile = req.files.image[0];
    const audioFile = req.files.audio[0];

    console.log(`Received image: ${imageFile.originalname} (${imageFile.size} bytes)`);
    console.log(`Received audio: ${audioFile.originalname} (${audioFile.size} bytes)`);

    // Mock render delay (2-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Return mock success response
    res.json({
      status: 'success',
      videoUrl: 'https://backend-api-c1hc.onrender.com/sample-output.mp4'
    });

  } catch (error) {
    console.error('Render error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message || 'Failed to render video'
    });
  }
});

// Error handler for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ status: 'error', error: err.message });
  }
  if (err) {
    return res.status(400).json({ status: 'error', error: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
