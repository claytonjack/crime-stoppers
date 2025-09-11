const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const port = 3000;
const SECRET = "supersecretkey";

// CORS for frontend
app.use(cors({ origin: ["http://localhost:8100"] }));

// Allowed files
const allowedFiles = [
  "2025_volunteer_application.pdf",
  "2025_youth_application.pdf",
  "2018_board_of_directors_application.pdf",
];

// Request download/preview: backend creates a short-lived token
app.get("/api/request-download/:file", (req, res) => {
  const file = req.params.file;
  if (!allowedFiles.includes(file)) return res.status(403).json({ error: "File not allowed" });

  // Token valid for 5 minutes
  const token = jwt.sign({ file }, SECRET, { expiresIn: "5m" });

  res.json({
    previewUrl: `/api/preview/${token}`,
    downloadUrl: `/api/download/${token}`,
  });
});

// Preview PDF in browser
app.get("/api/preview/:token", (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, SECRET);
    const filePath = path.join(__dirname, "files", decoded.file);
    res.sendFile(filePath);
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired link" });
  }
});

// Download PDF as attachment
app.get("/api/download/:token", (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, SECRET);
    const filePath = path.join(__dirname, "files", decoded.file);
    res.download(filePath);
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired link" });
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));