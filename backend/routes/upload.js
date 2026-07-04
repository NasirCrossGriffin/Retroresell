const express = require('express');
const fs = require('node:fs/promises'); // Using the promise-based version for async/await
const path = require('node:path');
const multer = require('multer');
const SFTPClient = require('ssh2-sftp-client');
const router = express.Router();
const AWS = require('aws-sdk');


// Configure multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadMemoryStorage = multer({ storage: multer.memoryStorage() });

//Upload to assets folder locally
router.post('/local', uploadMemoryStorage.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    console.log("No file present")
    return res.status(400).send('No file uploaded');
  }

  try {
    const datetime = new Date();
    const fileName = file.originalname + '_' + datetime.toISOString();
    const destinationDirectory = process.env.ASSETS_DIR;
    const destinationPath = path.join(destinationDirectory, fileName);

    await fs.writeFile(destinationPath, file.buffer);

    console.log(`File '${fileName}' saved to '${destinationPath}'`);
    const publicUrl = `https://retro-resell.com/assets/${encodeURIComponent(fileName)}`;
    res.status(200).json({ message: "Uploaded", fileName, fileUrl: publicUrl });
  } catch (error) {
    console.error('Error saving uploaded file:', error);
    throw error;
  }
});

router.post("/remote", uploadMemoryStorage.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    const datetime = new Date();
    const fileName = req.file.originalname + '_' + datetime.toISOString();

    // 2) connect SFTP using env vars (best practice)
    const sftp = new SFTPClient();
    await sftp.connect({
      host: process.env.REMOTE_HOST,      // e.g. "retro-resell.com"
      port: Number(process.env.REMOTE_PORT || 22),
      username: process.env.REMOTE_USER,  // e.g. "deploy"
      password: process.env.REMOTE_PASSWORD,
    });

    // 3) remote path Nginx serves
    const remoteDir = process.env.REMOTE_ASSETS_DIR || "/portfolio/Retroresell/assets";
    const remotePath = `${remoteDir}/${fileName}`;

    // 4) ensure remote dir exists
    try { await sftp.mkdir(remoteDir, true); } catch (_) {}

    // 5) upload buffer
    await sftp.put(req.file.buffer, remotePath);

    // 6) set sane permissions (readable by nginx)
    try { await sftp.chmod(remotePath, 0o644); } catch (_) {}

    await sftp.end();

    // public URL the client can use immediately
    const publicUrl = `https://retro-resell.com/assets/${encodeURIComponent(fileName)}`;
    res.status(200).json({ message: "Uploaded", fileName, fileUrl: publicUrl });
  } catch (err) {
    console.error("Remote upload failed:", err);
    res.status(500).send("Remote upload failed");
  }
});

module.exports = router;
