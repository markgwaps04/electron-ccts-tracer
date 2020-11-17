console.log("main process working");

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const { autoUpdater } = require('electron-updater');
let win;

autoUpdater.autoDownload = false;


function createWindow()
{
    win = new BrowserWindow({
        title : "ICT PORTAL v" + app.getVersion(),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    win.maximize();

    win.once('ready-to-show', () => {
       autoUpdater.checkForUpdates();
    });

    autoUpdater.on('update-available', () => {
        win.loadFile(path.join(__dirname, 'view/update_helper.html'))
    });

    autoUpdater.on('update-downloaded', () => {
        autoUpdater.quitAndInstall();
    });

    autoUpdater.on('download-progress', (progressObj) => {
        // let log_message = "Download speed: " + progressObj.bytesPerSecond;
        // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
        // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
        win.webContents.send("download-progress",{
            "progress_percent" : Math.round(progressObj.percent),
            "download_per_second" : progressObj.bytesPerSecond,
            "total" : progressObj.total
        });
    });


    ipc.on("access_download_new_release", function (event, data) {

        const a = autoUpdater.downloadUpdate()
        a.then(function (b) {
            //Path
            console.log(b);
        });

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

    let query = {}

    if (data.hasOwnProperty("email"))
    {
        const of_query = {
            query : {
                "Email" : data.email,
                "start" : {"$gte" : d.toISOString()}
            },
            sort : { "_id" : data.sort }
        }

        query = Object.assign(query, of_query);
    }
    else
    {
        const of_query = {
            query : {
                "First_Name" : {'$regex': data.first_name},
                "Name" : {'$regex': data.last_name}
            }
        }

        query = Object.assign(query, of_query);

    }


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