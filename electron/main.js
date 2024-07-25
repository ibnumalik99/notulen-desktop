const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { Notulen } = require('@tarikhagustia/notulen');
const { MeetingResult } = require('@tarikhagustia/notulen/dist/interfaces');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('src/index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const client = new Notulen({
    name: "My Assistant",
    googleMeetUrl: "https://meet.google.com/kmt-ftvz-qap",
    language: "id-ID",
    geminiApiKey: "AIzaSyC6jfxBUCTV6LBcxYUdPnHU0gfQI81oXV8",
    debug: false
});

ipcMain.handle('start-meeting', async () => {
    async function main() {
        await client.listen();

        client.on("end", (result) => {
            console.log("Summary:");
            console.log(result.summary);
        
            process.exit(0);
        });    
    }
    await main();
});

ipcMain.handle('stop-meeting', async () => {
    try {
        await client.stop();
    } catch (error) {
        console.error('Error stopping meeting:', error);
    }
});