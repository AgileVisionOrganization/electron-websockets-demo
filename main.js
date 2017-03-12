const {app, Menu, Tray, shell, dialog} = require('electron')
const path = require('path')
const socketClient = require('socket.io-client')
const serverUrl = 'http://eb-event-forwarder-dev.eu-central-1.elasticbeanstalk.com/';

const iconPath = path.join(__dirname, 'Icon.png')
let tray = null

app.on('ready', () => {
  tray = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate(
    [
        {
          label: 'Exit',
          selector: 'terminate:',
        }
    ]
  )

  tray.setToolTip('AWS IoT Demo')
  tray.setContextMenu(contextMenu)

  socket = socketClient(serverUrl)

  socket.on('connect', function(){
    console.log('Connected to the server', serverUrl);
  });

  socket.on('disconnect', function(){
    console.log('Disconnected from the server');
  });

  socket.on('event', function(event){
    dialog.showMessageBox(
      {
        type: 'info',
        title: 'Received an event',
        detail: 'Received an event: ' + event.Message
      }
    )
  })
})
