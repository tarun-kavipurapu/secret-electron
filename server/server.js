const express = require("express");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");

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

    const fileList = files.filter((file) =>
      fs.statSync(path.join(directoryPath, file)).isFile()
    );
    res.json(fileList);
  });
});

// Endpoint to download all files as a zip
app.get("/download-all", (req, res) => {
  const directoryPath = path.join(__dirname, "public");

  res.attachment("all_files.zip");
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  archive.on("error", (err) => {
    res.status(500).send({ error: err.message });
  });

  archive.pipe(res);

  // Add each file in the 'public' directory to the zip archive
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan directory");
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      if (fs.statSync(filePath).isFile()) {
        archive.file(filePath, { name: file });
      }
    });

    archive.finalize();
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
