const electron = require('electron');
const { app, BrowserWindow, Menu } = electron
const path = require('path');
const url = require('url');

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

// Template for the Menu
menuTemplate = [{
    label: 'Electron App',
    submenu: [{
        label: 'About',
        click: () => {
            openAboutWindow()
        }
    }]
}];

// Keep a global reference so the garbage collector does not destroy our app
let mainWindow

function createWindow() {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        //icon: __dirname + 'icons/fb.png'
    })

    // Load the index.html file
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Set up the menu
    var menu = Menu.buildFromTemplate(menuTemplate)
    mainWindow.setMenu(menu)

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

// Opens the about window
function openAboutWindow() {

    let aboutWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        show: false,
        width: 700,
        height: 400
    })
    aboutWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'about.html'),
        protocol: 'file:',
        slashes: true
    }))
    aboutWindow.setMenu(null)
    aboutWindow.once('ready-to-show', () => {
        aboutWindow.show()
    })
};

// Create the window then the app is ready
app.on('ready', () => {
    createWindow()
    electron.powerMonitor.on('on-ac', () => {
        mainWindow.restore()
    })
    electron.powerMonitor.on('on-battery', () => {
        mainWindow.minimize()
    })
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

// Reopen the app on macOS
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});


function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};