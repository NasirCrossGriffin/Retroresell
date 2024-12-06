const express = require('express');
const multer = require('multer');
const router = express.Router();
const AWS = require('aws-sdk');


// Configure multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS,       // Correct variable for access key
    secretAccessKey: process.env.AWS_SECRET,  // Correct variable for secret key
    region: 'us-east-2',                      // Your bucket region
});
  
  // Create S3 instance
  const s3 = new AWS.S3();

// Your S3 bucket name
const retroresellbucket = 'retroresellbucket';

// File upload route
router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    console.log("No file present")
    return res.status(400).send('No file uploaded');
  }

  // Configure S3 upload parameters
  const params = {
    Bucket: retroresellbucket,
    Key: file.originalname, // File name in S3
    Body: file.buffer, // File content
    ContentType: file.mimetype, // File MIME type
  };

  try {
    // Upload file to S3
    const uploadResult = await s3.upload(params).promise();
    res.status(200).send({
      message: 'File uploaded successfully',
      fileUrl: uploadResult.Location, // S3 file URL
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
});

module.exports = router;
