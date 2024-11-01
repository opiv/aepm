const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'src/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile('index.html');
  Menu.setApplicationMenu(null);
}

app.on('ready', () => {
  createWindow();
});
  

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });
    if (result.filePaths[0].includes("\\Support Files"))
    {
        return result.filePaths[0]
    } else {
        alert('Please select the After Effects path including the "Support Files" folder.')
    }
});
  
ipcMain.on('save-path', (event, folderPath) => {
    const configPath = path.join(__dirname, 'src', 'config.cfg');
    if (!fs.existsSync(path.join(__dirname, 'src'))) {
        fs.mkdirSync(path.join(__dirname, 'src'));
    }
    fs.writeFileSync(configPath, `ae=${folderPath}`, 'utf-8');
});


ipcMain.handle('select-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Supported Files', extensions: ['zip', 'ffx'] },
    ],
  });
  if (canceled) {
    return null;
  } else {
    return filePaths[0];
  }
});