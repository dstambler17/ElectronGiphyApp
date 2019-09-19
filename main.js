const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu
//const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const Tray = electron.Tray
const globalShortcut = electron.globalShortcut
const MenuItem = electron.MenuItem

let tray = null;
let win;
let winTwo;
const iconPath = path.join(__dirname, '/icons/cool.png')

function createWindow () {

  win = new BrowserWindow({
    width: 800,
    height: 600,
    x: 200,
    y: 150,
    webPreferences: {
      nodeIntegration: true
    },
    icon: iconPath
  })

  winTwo = new BrowserWindow({
    width: 300,
    height: 600,
    x: 1000,
    y: 150,
    webPreferences: {
      nodeIntegration: true
    },

    icon: iconPath
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  winTwo.loadURL(url.format({
    pathname: path.join(__dirname, 'search.html'),
    protocol: 'file:',
    slashes: true
  }));


  win.on('closed', () => {
    win = null
  });

  winTwo.on('closed', () => {
    winTwo = null
  });

}


app.on('ready', function (){
  createWindow();
  tray = new Tray(iconPath)
  let template = [
    {
      label: 'Giph',
      submenu: [
        {
          label: 'App is good',
          type: 'radio',
          checked: true
        },
        {
          label: 'App is decent',
          type: 'radio',
        }
      ]
    }
  ]

  //Right click menu
  const ctxMenu = new Menu()
  ctxMenu.append(new MenuItem(
    {
      label: 'Show Developer Tools',
      click: function(){
        win.webContents.openDevTools();
      }
    }
  ))
  ctxMenu.append(new MenuItem({role: 'reload'}))
  ctxMenu.append(new MenuItem({ role: 'selectall' }))
  win.webContents.on('context-menu', function (e, params) {
    ctxMenu.popup(win, params.x, params.y)
  })

  //right click menu window two
  const ctxMenuTwo = new Menu()
  ctxMenuTwo.append(new MenuItem(
    {
      label: 'Show Developer Tools',
      click: function(){
        winTwo.webContents.openDevTools();
      }
    }
  ))
  ctxMenuTwo.append(new MenuItem({ role: 'selectall' }))
  winTwo.webContents.on('context-menu', function (e, params) {
    ctxMenuTwo.popup(win, params.x, params.y)
  })




  const contextMenu = Menu.buildFromTemplate(template)
  tray.setContextMenu(contextMenu)
  tray.setToolTip('Giphy App')

  globalShortcut.register('Alt+5', function () {
    if (win !== null){
      win.show()
    }
  })

  globalShortcut.register('Alt+6', function () {
    if (winTwo !== null){
      winTwo.show()
    }
  })

  globalShortcut.register('Alt+1', function () {
    if (win !== null){
      win.close()
    }
  })

  globalShortcut.register('Alt+2', function () {
    if (winTwo !== null){
      winTwo.close()
    }
  })

  globalShortcut.register('Ctrl+Shift+c', function () {
    if (win !== null){
      win.close()
    }
    if (winTwo !== null){
      winTwo.close()
    }
    
  })

  globalShortcut.register('Ctrl+Shift+s', function () {
    if (win !== null){
      win.show()
    }
    if (winTwo !== null){
      winTwo.show()
    }
  })

});

app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});