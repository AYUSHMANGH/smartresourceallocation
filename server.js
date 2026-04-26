import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const distPath = path.join(__dirname, 'dist');

// Check if dist exists
if (!fs.existsSync(distPath)) {
  console.error('ERROR: dist directory not found! Did the build fail?');
}

// Serve static files from the 'dist' directory
app.use(express.static(distPath));

// Handle SPA routing: return index.html for all non-static requests
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found. Build may have failed.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
