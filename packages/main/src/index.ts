import { app, BrowserView, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { URL } from 'url';
import './security-restrictions';

const isSingleInstance = app.requestSingleInstanceLock();
const isDevelopment = import.meta.env.MODE === 'development';

if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

app.disableHardwareAcceleration();

// Install "react devtools"
if (isDevelopment) {
  app
    .whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({ default: installExtension, REACT_DEVELOPER_TOOLS }) =>
      installExtension(REACT_DEVELOPER_TOOLS, {
        loadExtensionOptions: {
          allowFileAccess: true,
        },
      }),
    )
    .catch((e) => console.error('Failed install extension:', e));
}

let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: true,
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(__dirname, '../../preload/dist/index.cjs'),
    },
  });
  const browserView1 = new BrowserView({
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });
  browserView1.webContents.loadURL('https://www.google.com');
  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
    if (isDevelopment) {
      mainWindow?.webContents.openDevTools({ mode: 'detach' });
    }
  });

  ipcMain.on('open-web-page', (event, url) => {
    mainWindow?.addBrowserView(browserView1);
    const bounds = {
      width: 600,
      height: 600,
      ...mainWindow?.getBounds(),
      x: 60,
      y: 0,
    };
    browserView1.setBounds(bounds);
    browserView1.setAutoResize({ width: true, height: true });
    browserView1.webContents.loadURL(url);
  });
  ipcMain.on('close-web-page', () => {
    mainWindow?.removeBrowserView(browserView1);
  });
  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl =
    isDevelopment && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL(
          '../renderer/dist/index.html',
          'file://' + __dirname,
        ).toString();

  await mainWindow.loadURL(pageUrl);
};

app.on('second-instance', () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(createWindow)
  .catch((e) => console.error('Failed create window:', e));

// Auto-updates
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e));
}
