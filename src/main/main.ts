/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const qri = require('qr-image');

const nodeFs = require('fs');
const electronApp = require('electron').app;

const appUserDataPath = electronApp.getPath('userData');
const home = process.env.HOME || process.env.USERPROFILE;
const store = new Store();

const DEBUG = true;
export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const defaultConfig = `
{
	"utm_target": {
		"label": "Link Target",
		"tooltip": "Where will this link point to?",
		"error": "Please enter a valid URL",
		"RestrictBases": true,
		"value": [{
				"id": "startree-ai",
				"value": "http://startree.ai/"
			},
			{
				"id": "startree-docs",
				"value": "https://startree.ai/docs/"
			},
			{
				"id": "startree-recipes",
				"value": "https://dev.startree.ai/docs/pinot/recipes/"
			}
		],
		"target_field": {
			"showName": true,
			"label": "Referral Source",
			"ariaLabel": "Referral Source",
			"tooltip": "Where will you be posting this link?",
			"error": "Please enter a valid target",
			"value": [{
				"id": "",
				"value": ""
			}]
		}
	},
	"utm_term": {
		"showName": true,
		"label": "Division/Group",
		"ariaLabel": "Referral Source",
		"tooltip": "What division/Group are you in?",
		"error": "Please choose a valid division/group",
		"value": [{
				"id": "DevRel",
				"value": "DevRel"
			},
			{
				"id": "Marketing",
				"value": "Marketing"
			},
			{
				"id": "Product",
				"value": "Product"
			},
			{
				"id": "Engineering",
				"value": "Engineering"
			},
			{
				"id": "CTO",
				"value": "CTO"
			},
			{
				"id": "Sales",
				"value": "Sales"
			},
			{
				"id": "CEO",
				"value": "CEO"
			}
		]
	},
	"utm_medium": {
		"showName": true,
		"label": "Referral Type",
		"ariaLabel": "Referral Source",
		"tooltip": "What kind of referral link is this?",
		"error": "Please choose a valid referral type",
		"value": [{
				"id": "Blog-Post",
				"value": "Blog Post"
			},
			{
				"id": "Twitter",
				"value": "Twitter"
			},
			{
				"id": "LinkedIn",
				"value": "LinkedIn"
			},
			{
				"id": "Facebook",
				"value": "Facebook"
			},
			{
				"id": "dev-to",
				"value": "dev.to"
			},
			{
				"id": "Dzone",
				"value": "DZone"
			},
			{
				"id": "Medium",
				"value": "Medium"
			},
			{
				"id": "GitHub",
				"value": "GitHub"
			},
			{
				"id": "GitLab",
				"value": "GitLab"
			},
			{
				"id": "Stack-overflow",
				"value": "Stack Overflow"
			},
			{
				"id": "Reddit",
				"value": "Reddit"
			},
			{
				"id": "Slack",
				"value": "Slack"
			},
			{
				"id": "Disccord",
				"value": "Discord"
			},
			{
				"id": "Email",
				"value": "Email"
			},
			{
				"id": "Other",
				"value": "Other"
			}
		]
	},
	"utm_source": {
		"showName": true,
		"label": "Referral Source",
		"ariaLabel": "Referral Source",
		"tooltip": "Where will you be posting this link?",
		"error": "Please enter a valid referral source"
	},
	"utm_campaign": {
		"showName": true,
		"label": "Full Name",
		"ariaLabel": "Enter your Full Name",
		"tooltip": "Enter your full first and last names?",
		"error": "You need to enter your full first and last names please."
	}
}
`;
let mainWindow: BrowserWindow | null = null;

export interface IpcRequest {
  responseChannel?: string;

  params?: string;
}

ipcMain.handle('get-qr', (event: Event, link: string) => {
  if (link === '') {
    return '';
  }
  const qrSvg = qri.imageSync(link, { type: 'svg' });
  return qrSvg;
});


ipcMain.handle('home-path', () => {
  return home;
});

ipcMain.handle('save-config', (event: Event, config: string) => {
  store.set('link-builder-config', config);
  const conf: string = store.get('link-builder-config', defaultConfig);
  return JSON.parse(conf);
});

ipcMain.handle('get-config', (event: Event) => {
  const conf: string = store.get('link-builder-config', defaultConfig);
  return JSON.parse(conf);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1190,
    height: 1064,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
