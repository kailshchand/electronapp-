var electronInstaller = require('electron-winstaller');

// In this case, we can use relative paths
var settings = {
    noMsi: true,

    // Specify the folder where the built app is located
    appDirectory: './nodeEapp-built-win32-x64',

    // Specify the existing folder where 
    outputDirectory: './nodeEapp-built-installer',

    // The name of the Author of the app (the name of your company)
    authors: 'Dhaliwal Inc.',

    // The name of the owner of the app (the name of your company)
    owners: 'Ranbir Dhaliwal',

    // The name of the executable of your built
    exe: './nodeEapp-built.exe',

    // The name of the executable of your built
    setupExe: './nodeEapp.exe',

    // setup of msi file
    setupMsi: './nodeEapp-msi.exe',

    // description about the app
    description: 'electron first project with installer',

    iconUrl: 'https://raw.githubusercontent.com/dhaliwal7771/erepo/master/edhaliwal.ico',

    title: 'Dhaliwal Electron'
};

resultPromise = electronInstaller.createWindowsInstaller(settings);

resultPromise.then(() => {
    console.log("The installers of your application were successfully created !");
}, (e) => {
    console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});