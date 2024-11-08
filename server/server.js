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

  // Read files in the 'public' directory
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

// Watch the 'public' directory for changes
fs.watch(path.join(__dirname, "public"), (eventType, filename) => {
  if (filename) {
    console.log(`File ${filename} has been ${eventType}`);
    // You can add additional logic here, but for now we're just detecting changes
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
