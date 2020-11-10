console.log("main process working");

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const updater = electron.autoUpdater;

let win;

updater.on("error", function (details) {
    console.log(details);
});

updater.setFeedURL({ url : "https://bitbucket.org/MarkAnthonyLibres/electron-digos-ccts-tracer/src/master/yuan11-win32-x64/" })

function createWindow()
{
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'view/index.html'),
        protocol : 'file',
        slashes : true
    }));

    win.on('closed', () => {
        win = null;
    })

}

function serialize_as_url_params(that_object)
{

    return Object.keys(that_object).map(function(key) {

        const that_value = that_object[key];

        if (Number.isInteger(that_value))
            return key + '=' + that_object[key];

        return key + '=' + JSON.stringify(that_object[key]);

    }).join('&');

}


app.on("ready", createWindow);

ipc.on("trace_email", function (event, data) {

    var d = new Date();
    d.setDate(d.getDate() - (data.days));

    let query = {
        query : {
            "Email" : data.email,
            "start" : {"$gte" : d.toISOString()}
        },
        sort : { "_id" : data.sort }
    };


    data.limit = data.limit || 0;

    if (data.limit > 0)
        query['limit'] = data.limit

    const of_query = serialize_as_url_params(query);

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        title : "EXPORT PDF",
        show : false
    });

    win.loadURL('http://citizens.digoscity.online/api/pdf/query', {
        postData: [{
            type: 'rawData',
            bytes: Buffer.from(of_query)
        }],
        extraHeaders: 'Content-Type: application/x-www-form-urlencoded'
    });

    win.webContents.on('did-finish-load', function() {
        win.show();
        win.maximize()
        event.sender.send("trace_email_done");
    });
});

app.on("window-all-closed", function () {
    if(process.platform !== "darwin")
    {
        app.quit();
    }

})

app.on('activate', function () {
    if (win==null)
        createWindow();
})