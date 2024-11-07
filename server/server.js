const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Endpoint to list files in the 'public' directory
app.get("/files", (req, res) => {
  const directoryPath = path.join(__dirname, "public");
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan directory");
    }
    // Filter out directories, only list files
    const fileList = files.filter((file) =>
      fs.statSync(path.join(directoryPath, file)).isFile()
    );
    res.json(fileList);
  });
});

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);

  // Establish ngrok tunnel
});
