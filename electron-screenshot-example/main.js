const {
  app,
  desktopCapturer,
  screen,
  ipcMain,
  globalShortcut,
} = require("electron");
const path = require("path");
const fs = require("fs");

// Register global shortcut for capturing screenshot
function registerShortcut() {
  globalShortcut.register("`", async () => {
    const screenShotInfo = await captureScreen();
    if (screenShotInfo) {
      // Define the directory path one level up from the project folder
      const screenshotDir = path.join(__dirname, "../server/public");

      // Ensure the "pictures" folder exists
      fs.mkdirSync(screenshotDir, { recursive: true });

      // Get the next available file name
      const screenshotPath = getNextScreenshotPath(screenshotDir);

      // Save the screenshot
      fs.writeFileSync(screenshotPath, screenShotInfo.toPNG());
      console.log(`Screenshot saved to ${screenshotPath}`);
    }
  });
}

// Function to get the next available screenshot file path
function getNextScreenshotPath(directory) {
  const files = fs.readdirSync(directory);

  // Find the highest existing screenshot number
  const highestNumber = files
    .map((file) => parseInt(file.match(/screenshot_(\d+)\.png/)?.[1] || 0))
    .reduce((max, num) => Math.max(max, num), 0);

  // Generate the next file path with an incremented number
  return path.join(directory, `screenshot_${highestNumber + 1}.png`);
}

app.whenReady().then(() => {
  // Register the global shortcut
  registerShortcut();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Unregister shortcuts when the app quits
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

async function captureScreen() {
  try {
    // Get the primary display's size
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.size;

    // Set up options for desktopCapturer to capture the screen
    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: { width, height },
    });

    // Find the source corresponding to the primary display
    const primarySource = sources.find(
      (source) => source.display_id === primaryDisplay.id.toString()
    );

    if (!primarySource) {
      console.error("Primary display source not found.");
      return null;
    }

    // Return the image thumbnail for further processing
    return primarySource.thumbnail;
  } catch (error) {
    console.error("Failed to capture screen:", error);
    return null;
  }
}
